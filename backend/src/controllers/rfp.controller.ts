import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { generateRFPStructure } from '../services/gemini.service';
import { sendEmail } from '../services/email.service';
import { fetchUnseenEmails } from '../services/imap.service';
import { parseProposal, compareProposalsAI } from '../services/gemini.service';

export const compareProposals = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const rfp = await prisma.rFP.findUnique({
            where: { id },
            include: { proposals: { include: { vendor: true } } },
        });
        if (!rfp) return res.status(404).json({ error: 'RFP not found' });

        if (rfp.proposals.length === 0) {
            return res.json({ message: 'No proposals to compare', comparison: null });
        }

        const comparison = await compareProposalsAI(rfp.description, rfp.proposals);
        res.json(comparison);
    } catch (error) {
        res.status(500).json({ error: 'Failed to compare proposals' });
    }
};

export const checkEmails = async (req: Request, res: Response) => {
    try {
        console.log("Starting checkEmails...");

        const emails = await fetchUnseenEmails();
        console.log(`Fetched ${emails.length} emails from IMAP`);

        if (emails.length === 0) {
            console.log("No new emails found, returning early");
            return res.json({
                message: 'No new emails found',
                count: 0,
                results: []
            });
        }

        // Optimization 1: Fetch vendors once, outside the loop
        const vendors = await prisma.vendor.findMany();
        console.log(`Found ${vendors.length} vendors in database`);

        // Optimization 2: Create a Map for O(1) vendor lookup by email
        const vendorEmailMap = new Map<string, typeof vendors[0]>();
        vendors.forEach(vendor => {
            vendorEmailMap.set(vendor.email.toLowerCase(), vendor);
        });

        const results = [];

        for (let i = 0; i < emails.length; i++) {
            const email = emails[i];
            console.log(`Processing email ${i + 1}/${emails.length} from: ${email.from}`);

            if (!email.text || !email.from) {
                console.log(`Skipping email - missing text or from field`);
                continue;
            }

            // Extract email address from "Name <email>" format
            const emailMatch = email.from.match(/[\w\.-]+@[\w\.-]+\.\w+/);
            const extractedEmail = emailMatch ? emailMatch[0].toLowerCase() : email.from.toLowerCase();
            console.log(`Extracted email: "${extractedEmail}"`);

            // Optimization 3: Direct O(1) lookup instead of O(n) find
            const vendor = vendorEmailMap.get(extractedEmail);

            if (!vendor) {
                console.log(`No matching vendor found for: ${email.from}`);
                results.push({ status: 'Unknown vendor', from: email.from });
                continue;
            }

            console.log(`Matched vendor: ${vendor.name}`);

            // Parse proposal with AI
            console.log(`Parsing proposal with AI...`);
            const parsedData = await parseProposal(email.text);
            console.log(`AI parsing complete`);

            // Optimization 4: Combine RFP lookup and duplicate check in a single query flow
            console.log(`Looking for RFP sent to this vendor...`);
            const rfpVendor = await prisma.rFPVendor.findFirst({
                where: {
                    vendorId: vendor.id,
                    rfp: { status: 'SENT' }
                },
                include: {
                    rfp: {
                        include: {
                            proposals: {
                                where: { vendorId: vendor.id },
                                select: { id: true }
                            }
                        }
                    }
                },
                orderBy: { sentAt: 'desc' }
            });

            if (!rfpVendor) {
                console.log(`No RFP found that was sent to this vendor`);
                results.push({ status: 'No RFP sent to this vendor', vendor: vendor.name });
                continue;
            }

            const rfp = rfpVendor.rfp;
            console.log(`Found RFP: ${rfp.title} (sent to this vendor)`);

            // Check if proposal already exists (now included in the query above)
            if (rfp.proposals.length > 0) {
                console.log(`Proposal already exists for this RFP and vendor, skipping...`);
                results.push({ status: 'Duplicate', vendor: vendor.name, rfp: rfp.title });
                continue;
            }

            // Create new proposal
            await prisma.proposal.create({
                data: {
                    rfpId: rfp.id,
                    vendorId: vendor.id,
                    content: email.text,
                    parsedData: JSON.stringify(parsedData),
                    receivedAt: email.date || new Date(),
                }
            });
            console.log(`Proposal created successfully`);
            results.push({ status: 'Parsed', vendor: vendor.name, rfp: rfp.title });
        }

        console.log(`Finished processing all emails. Sending response...`);
        res.json({ message: 'Emails checked', count: emails.length, results });
    } catch (error: any) {
        console.error('Error in checkEmails:', error);
        res.status(500).json({
            error: 'Failed to check emails',
            message: error.message || 'Unknown error',
            hint: 'Please check your email credentials in .env file'
        });
    }
};

export const sendRFP = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { vendorIds } = req.body; // Array of vendor IDs

    try {
        const rfp = await prisma.rFP.findUnique({ where: { id } });
        if (!rfp) return res.status(404).json({ error: 'RFP not found' });

        const vendors = await prisma.vendor.findMany({
            where: { id: { in: vendorIds } },
        });

        if (vendors.length === 0) {
            return res.status(400).json({ error: 'No valid vendors selected' });
        }

        const subject = `RFP: ${rfp.title}`;
        const text = `Dear Vendor,\n\nPlease review the following RFP:\n\n${rfp.description}\n\nPlease reply to this email with your proposal.\n\nRegards,\nProcurement Team`;

        // Send emails and track which vendors received this RFP
        for (const vendor of vendors) {
            await sendEmail(vendor.email, subject, text);

            // Create RFPVendor record to track this relationship
            await prisma.rFPVendor.upsert({
                where: {
                    rfpId_vendorId: {
                        rfpId: id,
                        vendorId: vendor.id
                    }
                },
                update: {
                    sentAt: new Date()
                },
                create: {
                    rfpId: id,
                    vendorId: vendor.id
                }
            });
        }

        await prisma.rFP.update({
            where: { id },
            data: { status: 'SENT' },
        });

        res.json({ message: `RFP sent to ${vendors.length} vendors` });
    } catch (error) {
        console.error('Error in sendRFP:', error);
        res.status(500).json({ error: 'Failed to send RFP' });
    }
};

export const generateRFP = async (req: Request, res: Response) => {
    const { description } = req.body;
    if (!description) {
        return res.status(400).json({ error: 'Description is required' });
    }

    try {
        const structuredData = await generateRFPStructure(description);
        res.json({ description, structuredData });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate RFP structure' });
    }
};

export const createRFP = async (req: Request, res: Response) => {
    const { title, description, structuredData } = req.body;

    try {
        const rfp = await prisma.rFP.create({
            data: {
                title: title || structuredData.title || 'Untitled RFP',
                description,
                structuredData: JSON.stringify(structuredData),
                status: 'DRAFT',
            },
        });
        res.status(201).json(rfp);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create RFP' });
    }
};

export const getRFPs = async (req: Request, res: Response) => {
    try {
        const rfps = await prisma.rFP.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(rfps);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch RFPs' });
    }
};

export const getRFPById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const rfp = await prisma.rFP.findUnique({
            where: { id },
            include: {
                proposals: {
                    include: { vendor: true },
                    orderBy: { receivedAt: 'desc' }
                }
            },
        });
        if (!rfp) return res.status(404).json({ error: 'RFP not found' });
        res.json(rfp);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch RFP' });
    }
};
