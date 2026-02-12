import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { AppError } from '../../infrastructure/utils/AppError';
import prisma from '../../infrastructure/database/prisma';
import { getIO } from '../../core/socket';

export const getAllEvidence = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authReq = req as AuthRequest;
        let filter: any = {};

        // RBAC: Teachers only see their own evidence
        if (authReq.user?.role === 'TEACHER') {
            filter = { userId: authReq.user.id };
        }

        const evidence = await prisma.courseEvidence.findMany({
            where: filter,
            orderBy: { submittedAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        campusId: true
                    }
                }
            }
        });

        res.status(200).json({
            status: 'success',
            results: evidence.length,
            data: { evidence }
        });
    } catch (err) {
        next(err);
    }
};

export const submitEvidence = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authReq = req as AuthRequest;
        const data = req.body;

        if (!authReq.user) {
            return next(new AppError('You must be logged in to submit evidence', 401));
        }

        const newEvidence = await prisma.courseEvidence.create({
            data: {
                userId: authReq.user.id,
                email: data.email || authReq.user.email,
                name: data.name || authReq.user.fullName,
                campus: data.campus || 'Unknown',

                courseName: data.courseName,
                hours: Number(data.hours),
                platform: data.platform,
                otherPlatform: data.otherPlatform,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),

                hasCertificate: data.hasCertificate,
                proofLink: data.proofLink,
                certificateType: data.certificateType,
                certificateFile: data.certificateFile,
                certificateFileName: data.certificateFileName,

                keyTakeaways: data.keyTakeaways,
                unansweredQuestions: data.unansweredQuestions,
                enjoyedMost: data.enjoyedMost,

                effectivenessRating: Number(data.effectivenessRating?.[0] || data.effectivenessRating || 5),
                additionalFeedback: data.additionalFeedback,

                supportingDocType: data.supportingDocType,
                supportingDocLink: data.supportingDocLink,
                supportingDocFile: data.supportingDocFile,
                supportingDocFileName: data.supportingDocFileName
            },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true
                    }
                }
            }
        });

        // Broadcast to leaders/admins
        getIO().emit('course-evidence:created', newEvidence);

        res.status(201).json({
            status: 'success',
            data: { evidence: newEvidence }
        });
    } catch (err: any) {
        console.error("Error submitting course evidence:", err);
        next(err);
    }
};
