import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { AppError } from '../../infrastructure/utils/AppError';
import prisma from '../../infrastructure/database/prisma';
import { getIO } from '../../core/socket';

export const getAllObservations = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authReq = req as AuthRequest;
        let filter: any = {};

        // RBAC logic: Teachers only see their own
        if (authReq.user?.role === 'TEACHER') {
            filter = { teacherId: authReq.user.id };
        }

        const observations = await prisma.observation.findMany({
            where: filter
        });

        res.status(200).json({
            status: 'success',
            results: observations.length,
            data: { observations }
        });
    } catch (err) {
        next(err);
    }
};

export const createObservation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authReq = req as AuthRequest;
        const data = req.body;

        // Try to link to a teacher user if email is provided
        let teacherId = data.teacherId;
        if (!teacherId && data.teacherEmail) {
            const teacher = await prisma.user.findUnique({ where: { email: data.teacherEmail } });
            if (teacher) teacherId = teacher.id;
        }

        const newObservationData = {
            ...data,
            teacherId: teacherId || 'unknown', // Fallback
            observerId: authReq.user?.id,
            status: 'SUBMITTED',
            createdAt: new Date().toISOString()
        };

        const newObservation = await prisma.observation.create({
            data: newObservationData
        });

        // Real-time update
        getIO().emit('observation:created', newObservation);

        res.status(201).json({
            status: 'success',
            data: { observation: newObservation }
        });
    } catch (err) {
        next(err);
    }
};

export const updateObservation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const updatedObservation = await prisma.observation.update({
            where: { id },
            data: { ...data, updatedAt: new Date().toISOString() }
        });

        getIO().emit('observation:updated', updatedObservation);

        res.status(200).json({
            status: 'success',
            data: { observation: updatedObservation }
        });
    } catch (err) {
        next(err);
    }
};
