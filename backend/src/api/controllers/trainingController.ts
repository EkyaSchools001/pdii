import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../../infrastructure/utils/AppError';
import { AuthRequest } from '../middlewares/auth';

const prisma = new PrismaClient();

export const getAllTrainingEvents = async (req: AuthRequest, res: Response) => {
    try {
        const events = await prisma.trainingEvent.findMany({
            include: {
                registrations: {
                    include: {
                        user: {
                            select: {
                                fullName: true,
                                role: true
                            }
                        }
                    }
                }
            },
            orderBy: { date: 'asc' }
        });

        res.status(200).json({
            status: 'success',
            data: { events }
        });
    } catch (error: any) {
        console.error('Error fetching training events:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};

export const createTrainingEvent = async (req: AuthRequest, res: Response) => {
    try {
        const { title, topic, type, date, location, capacity, status, proposedById } = req.body;

        const event = await prisma.trainingEvent.create({
            data: {
                title,
                topic,
                type,
                date,
                location,
                capacity: parseInt(capacity),
                status: status || 'PLANNED',
                proposedById: proposedById || req.user?.id
            }
        });

        res.status(201).json({
            status: 'success',
            data: { event }
        });
    } catch (error: any) {
        console.error('Error creating training event:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};

export const registerForEvent = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const { eventId } = req.params;

        if (!userId) {
            throw new AppError('Authentication required', 401);
        }

        const registration = await prisma.registration.create({
            data: {
                userId,
                eventId: eventId as string,
            }
        });

        res.status(200).json({
            status: 'success',
            data: { registration }
        });
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(400).json({
                status: 'error',
                message: 'Already registered for this event'
            });
        }
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};

export const updateEventStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const event = await prisma.trainingEvent.update({
            where: { id: id as string },
            data: { status }
        });

        res.status(200).json({
            status: 'success',
            data: { event }
        });
    } catch (error: any) {
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};
