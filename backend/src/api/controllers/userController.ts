import { Request, Response, NextFunction } from 'express';
<<<<<<< HEAD
=======
import { Role } from '@prisma/client';
>>>>>>> 6a9198745ad4aeaac08f094cc2d989de31863c9a
import prisma from '../../infrastructure/database/prisma';
import { AppError } from '../../infrastructure/utils/AppError';
import bcrypt from 'bcryptjs';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
<<<<<<< HEAD
        const { role } = req.query;

        const whereClause: any = {};
        if (role) {
            whereClause.role = role;
        }

        const users = await prisma.user.findMany({
            where: whereClause,
=======
        const users = await prisma.user.findMany({
>>>>>>> 6a9198745ad4aeaac08f094cc2d989de31863c9a
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({
            status: 'success',
            results: users.length,
            data: { users }
        });
    } catch (err) {
        next(err);
    }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { fullName, email, role, campusId, department, password } = req.body;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return next(new AppError('User already exists with this email', 400));
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password || 'password123', 12);

        const newUser = await prisma.user.create({
            data: {
                fullName,
                email,
<<<<<<< HEAD
                role: role ? role : undefined,
=======
                role: role ? (role as Role) : undefined,
>>>>>>> 6a9198745ad4aeaac08f094cc2d989de31863c9a
                campusId,
                department,
                passwordHash: hashedPassword,
                status: 'Active'
            }
        });

        res.status(201).json({
            status: 'success',
            data: { user: newUser }
        });
    } catch (err) {
        next(err);
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (typeof id !== 'string') {
            return next(new AppError('Invalid user ID', 400));
        }

        const { fullName, role, campusId, department, status } = req.body;

        const updateData: any = {};
        if (fullName !== undefined) updateData.fullName = fullName;
<<<<<<< HEAD
        if (role !== undefined) updateData.role = role;
=======
        if (role !== undefined) updateData.role = role as Role;
>>>>>>> 6a9198745ad4aeaac08f094cc2d989de31863c9a
        if (campusId !== undefined) updateData.campusId = campusId;
        if (department !== undefined) updateData.department = department;
        if (status !== undefined) updateData.status = status;

        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData
        });

        res.status(200).json({
            status: 'success',
            data: { user: updatedUser }
        });
    } catch (err) {
        next(err);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (typeof id !== 'string') {
            return next(new AppError('Invalid user ID', 400));
        }

        await prisma.user.delete({ where: { id } });

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        next(err);
    }
};
