import { Request, Response, NextFunction } from 'express';
import prisma from '../../infrastructure/database/prisma';
import { AuthRequest } from '../middlewares/auth';
import { AppError } from '../../infrastructure/utils/AppError';
import { createGoalSchema } from '../../core/models/schemas';

export const getAllGoals = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authReq = req as AuthRequest;
        let filter = {};
        if (authReq.user?.role === 'TEACHER') {
            filter = { teacherId: authReq.user.id };
        }

        const goals = await prisma.goal.findMany({
            where: filter,
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({
            status: 'success',
            results: goals.length,
            data: { goals }
        });
    } catch (err) {
        next(err);
    }
};

export const createGoal = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authReq = req as AuthRequest;
        const result = createGoalSchema.safeParse(req.body);
        if (!result.success) {
            return next(new AppError('Validation failed', 400));
        }

        const newGoal = await prisma.goal.create({
            data: {
                ...result.data,
                teacherId: authReq.user!.id
            }
        });

        res.status(201).json({
            status: 'success',
            data: { goal: newGoal }
        });
    } catch (err) {
        next(err);
    }
};
