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

// In-memory storage for observations
const OBSERVATIONS = new Map<string, any>();

// Seed some initial data
OBSERVATIONS.set('1', {
    id: '1',
    teacher: 'Emily Rodriguez',
    teacherId: 'teacher-123',
    score: 4.2,
    date: 'Jan 15',
    domain: 'Instructional Practice',
    notes: 'Great engagement'
});

class MockPrismaClient {
    user = {
        findUnique: async ({ where }: any) => {
            return MOCK_USERS[where.email] || null;
        },
        create: async (args: any) => ({ ...args.data, id: Math.random().toString(36).substr(2, 9) }),
    };

    observation = {
        findMany: async (args: any) => {
            // Simple filter implementation
            let results = Array.from(OBSERVATIONS.values());
            if (args?.where?.teacherId) {
                results = results.filter(obs => obs.teacherId === args.where.teacherId);
            }
            // Sort by date descending (mock)
            return results.reverse();
        },
        create: async (args: any) => {
            const id = Math.random().toString(36).substr(2, 9);
            const newObs = { ...args.data, id, createdAt: new Date() };
            OBSERVATIONS.set(id, newObs);
            return newObs;
        },
        update: async (args: any) => {
            const id = args.where.id;
            const existing = OBSERVATIONS.get(id);
            if (!existing) throw new Error("Observation not found");
            const updated = { ...existing, ...args.data };
            OBSERVATIONS.set(id, updated);
            return updated;
        }
    };

    goal = {
        findMany: async (args: any) => [],
        create: async (args: any) => ({ ...args.data, id: Math.random().toString(36).substr(2, 9) }),
    };
}

const prisma = new MockPrismaClient();

export default prisma as any;
