import prisma from './infrastructure/database/prisma';
import bcrypt from 'bcryptjs';

async function main() {
    const password = await bcrypt.hash('password123', 10);

    // Users
    const admin = await prisma.user.upsert({
        where: { email: 'admin@pms.com' },
        update: {},
        create: {
            email: 'admin@pms.com',
            fullName: 'Admin User',
            password,
            role: 'ADMIN',
        },
    });

    const leader = await prisma.user.upsert({
        where: { email: 'schoolleader@pms.com' },
        update: {},
        create: {
            email: 'schoolleader@pms.com',
            fullName: 'Dr. Sarah Johnson',
            password,
            role: 'LEADER',
        },
    });

    const teacher = await prisma.user.upsert({
        where: { email: 'teacher@pms.com' },
        update: {},
        create: {
            email: 'teacher@pms.com',
            fullName: 'Emily Rodriguez',
            password,
            role: 'TEACHER',
        },
    });

    const management = await prisma.user.upsert({
        where: { email: 'management@pms.com' },
        update: {},
        create: {
            email: 'management@pms.com',
            fullName: 'Management User',
            password,
            role: 'MANAGEMENT',
        },
    });

    console.log('Seed data created!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
