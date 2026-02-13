import api from '@/lib/api';

export interface User {
    id: string;
    fullName: string;
    email: string;
    role: string;
    department?: string;
    campusId?: string;
    status: string;
}

export const userService = {
    async getAllUsers(role?: string) {
        try {
            const params = role ? { role } : {};
            const response = await api.get('/users', { params });
            return response.data.data.users;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },

    async getTeachers() {
        return this.getAllUsers('TEACHER');
    }
};
