import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { AppError } from '../../infrastructure/utils/AppError';
import { createObservationSchema } from '../../core/models/schemas';

export const getAllObservations = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authReq = req as AuthRequest;
        let filter = {};

        // RBAC logic: Teachers only see their own
        if (authReq.user?.role === 'TEACHER') {
            filter = { teacherId: authReq.user.id };
        }

        const mockObservations = [
            {
                id: '1',
                teacher: 'Emily Rodriguez',
                score: 4.2,
                date: 'Jan 15',
                domain: 'Instructional Practice',
                notes: 'Great engagement'
            }
        ];

        res.status(200).json({
            status: 'success',
            results: mockObservations.length,
            data: { observations: mockObservations }
        });
    } catch (err) {
        next(err);
    }
};

export const createObservation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authReq = req as AuthRequest;
        const result = createObservationSchema.safeParse(req.body);
        if (!result.success) {
            return next(new AppError('Validation failed', 400));
        }

        const newObservation = {
            ...result.data,
            id: Math.random().toString(36).substring(7),
            observerId: authReq.user!.id,
            createdAt: new Date().toISOString()
        };

        res.status(201).json({
            status: 'success',
            data: { observation: newObservation }
        });
    } catch (err) {
        next(err);
    }
};
