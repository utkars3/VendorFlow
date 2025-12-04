import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const createVendor = async (req: Request, res: Response) => {
    const { name, email, contactName } = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and Email are required' });
    }

    try {
        const vendor = await prisma.vendor.create({
            data: { name, email, contactName },
        });
        res.status(201).json(vendor);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create vendor' });
    }
};

export const getVendors = async (req: Request, res: Response) => {
    try {
        const vendors = await prisma.vendor.findMany({
            orderBy: { name: 'asc' },
        });
        res.json(vendors);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch vendors' });
    }
};
