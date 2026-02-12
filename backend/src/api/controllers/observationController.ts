import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { AppError } from '../../infrastructure/utils/AppError';
import prisma from '../../infrastructure/database/prisma';
import bcrypt from 'bcryptjs';
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
            where: filter,
            include: {
                teacher: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true
                    }
                }
            }
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
            if (teacher) {
                teacherId = teacher.id;
            } else {
                // Auto-create teacher if not found to support manual input
                try {
                    const newTeacher = await prisma.user.create({
                        data: {
                            email: data.teacherEmail,
                            fullName: data.teacher || 'Manual Entry Teacher',
                            password: await bcrypt.hash('Teacher@123', 10), // Default password
                            role: 'TEACHER'
                        }
                    });
                    teacherId = newTeacher.id;
                } catch (userErr) {
                    console.error("Error auto-creating teacher:", userErr);
                    // Fallback to unknown if creation fails (e.g. race condition)
                    teacherId = (await prisma.user.findUnique({ where: { email: data.teacherEmail } }))?.id || 'unknown';
                }
            }
        }

        const newObservationData = {
            teacherId: String(teacherId && teacherId !== 'unknown' ? teacherId : ''),
            observerId: String(authReq.user?.id || ''),
            date: String(data.date || new Date().toISOString()),
            domain: String(data.domain || 'General'),
            score: Number(data.score || 0),
            notes: String(data.notes || data.feedback || ''),
            status: 'SUBMITTED' as const,
            actionStep: String(data.actionStep || ''),
            teacherReflection: String(data.teacherReflection || ''),
            discussionMet: !!data.discussionMet,
            hasReflection: !!data.hasReflection,
            createdAt: new Date()
        };

        if (!newObservationData.teacherId || !newObservationData.observerId) {
            return next(new AppError('A valid teacher and authenticated observer are required', 400));
        }

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

        // Pick only fields supported by the Prisma schema
        // and normalize status case
        const updateData: any = {
            updatedAt: new Date()
        };

        if (data.teacherReflection !== undefined) updateData.teacherReflection = String(data.teacherReflection);
        if (data.detailedReflection !== undefined) updateData.detailedReflection = data.detailedReflection;
        if (data.hasReflection !== undefined) updateData.hasReflection = !!data.hasReflection;
        if (data.notes !== undefined) updateData.notes = String(data.notes);
        if (data.actionStep !== undefined) updateData.actionStep = String(data.actionStep);
        if (data.discussionMet !== undefined) updateData.discussionMet = !!data.discussionMet;
        if (data.score !== undefined) updateData.score = Number(data.score);
        if (data.domain !== undefined) updateData.domain = String(data.domain);

        if (data.status) {
            // Map common frontend statuses to DB enum
            const statusMap: Record<string, string> = {
                'Submitted': 'SUBMITTED',
                'submitted': 'SUBMITTED',
                'Draft': 'DRAFT',
                'draft': 'DRAFT',
                'Reviewed': 'REVIEWED',
                'reviewed': 'REVIEWED'
            };
            updateData.status = (statusMap[data.status] || data.status.toUpperCase()) as any;
        }

        const updatedObservation = await prisma.observation.update({
            where: { id: String(id) },
            data: updateData
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
