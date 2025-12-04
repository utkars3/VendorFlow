import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const vendors = [
        {
            name: 'TechCorp Solutions',
            email: 'sales@techcorp.example.com',
            contactName: 'John Smith',
        },
        {
            name: 'Global Supplies Inc',
            email: 'contact@globalsupplies.example.com',
            contactName: 'Jane Doe',
        },
        {
            name: 'FastTrack Logistics',
            email: 'info@fasttrack.example.com',
            contactName: 'Mike Johnson',
        },
    ];

    for (const v of vendors) {
        await prisma.vendor.upsert({
            where: { email: v.email },
            update: {},
            create: v,
        });
    }

    console.log('Seed data inserted');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
