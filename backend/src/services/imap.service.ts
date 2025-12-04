import imaps from 'imap-simple';
import { simpleParser } from 'mailparser';
import dotenv from 'dotenv';

dotenv.config();

const getConfig = () => ({
    imap: {
        user: process.env.EMAIL_USER!,
        password: process.env.EMAIL_PASS!,
        host: process.env.EMAIL_HOST!,
        port: 993,
        tls: true,
        tlsOptions: {
            rejectUnauthorized: false,
            servername: process.env.EMAIL_HOST!
        },
        authTimeout: 10000,
    },
});

export const fetchUnseenEmails = async () => {
    try {
        // console.log('Attempting to connect to IMAP server...');
        // console.log('IMAP Config:', {
        //     host: process.env.EMAIL_HOST,
        //     user: process.env.EMAIL_USER,
        //     port: 993,
        // });

        const connection = await imaps.connect(getConfig());
        // console.log('IMAP connection successful');

        await connection.openBox('INBOX');
        console.log('INBOX opened successfully');

        // Calculate date 2 days ago
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 1);
        const dateString = twoDaysAgo.toISOString().split('T')[0].replace(/-/g, '-');

        // Search for unseen emails from the past 2 days
        const searchCriteria = ['UNSEEN', ['SINCE', twoDaysAgo]];
        console.log('Searching for emails since:', dateString);

        const fetchOptions = {
            bodies: [''],
            markSeen: true,
        };

        const messages = await connection.search(searchCriteria, fetchOptions);
        // console.log(`Found ${messages.length} unseen messages`);

        const emails = [];

        for (const message of messages) {
            const all = message.parts.find((part: any) => part.which === '');

            if (all) {
                const parsed = await simpleParser(all.body);
                emails.push({
                    from: parsed.from?.text,
                    subject: parsed.subject,
                    text: parsed.text,
                    date: parsed.date,
                });
                // console.log(`Parsed email from: ${parsed.from?.text}`);
            }
        }

        connection.end();
        console.log(`Returning ${emails.length} emails`);
        return emails;
    } catch (error) {
        console.error("Error fetching emails:", error);
        console.error("Error details:", {
            message: error instanceof Error ? error.message : 'Unknown error',
            code: (error as any).code,
            stack: error instanceof Error ? error.stack : undefined
        });
        return [];
    }
};
