// Mock Prisma Client to allow testing without a live PostgreSQL database
const MOCK_PASSWORD_HASH = '$2b$10$TpqDsWBMtgoe5iLsgxLcPupoMd7naoAZKsWs2/GgYzkqJjJNkHcUG'; // 'password123'

const MOCK_USERS: Record<string, any> = {
    'admin@pms.com': {
        id: 'admin-123',
        email: 'admin@pms.com',
        fullName: 'Admin User',
        password: MOCK_PASSWORD_HASH,
        role: 'ADMIN',
    },
    'schoolleader@pms.com': {
        id: 'leader-123',
        email: 'schoolleader@pms.com',
        fullName: 'Dr. Sarah Johnson',
        password: MOCK_PASSWORD_HASH,
        role: 'LEADER',
    },
    'teacher@pms.com': {
        id: 'teacher-123',
        email: 'teacher@pms.com',
        fullName: 'Emily Rodriguez',
        password: MOCK_PASSWORD_HASH,
        role: 'TEACHER',
    },
    'management@pms.com': {
        id: 'management-123',
        email: 'management@pms.com',
        fullName: 'Management User',
        password: MOCK_PASSWORD_HASH,
        role: 'MANAGEMENT',
    },
    'superadmin@pms.com': {
        id: 'superadmin-123',
        email: 'superadmin@pms.com',
        fullName: 'Super Admin',
        password: MOCK_PASSWORD_HASH,
        role: 'SUPERADMIN',
    },
};

class MockPrismaClient {
    user = {
        findUnique: async ({ where }: any) => {
            return MOCK_USERS[where.email] || null;
        },
        create: async (args: any) => ({ ...args.data, id: Math.random().toString(36).substr(2, 9) }),
    };

    observation = {
        findMany: async (args: any) => [],
        create: async (args: any) => ({ ...args.data, id: Math.random().toString(36).substr(2, 9) }),
    };

    goal = {
        findMany: async (args: any) => [],
        create: async (args: any) => ({ ...args.data, id: Math.random().toString(36).substr(2, 9) }),
    };
}

const prisma = new MockPrismaClient();

export default prisma as any;
