import { Router } from 'express';
import observationRoutes from './observationRoutes';
import authRoutes from './authRoutes';
import goalRoutes from './goalRoutes';
import userRoutes from './userRoutes';

<<<<<<< HEAD
import uploadRoutes from './uploadRoutes';
import documentRoutes from './documentRoutes';
import moocRoutes from './moocRoutes';
import trainingRoutes from './trainingRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/goals', goalRoutes);
router.use('/observations', observationRoutes);
router.use('/documents', documentRoutes);
router.use('/upload', uploadRoutes);
router.use('/mooc', moocRoutes);
router.use('/training', trainingRoutes);
=======
const router = Router();

router.use('/auth', authRoutes);
router.use('/observations', observationRoutes);
router.use('/goals', goalRoutes);
router.use('/users', userRoutes);
>>>>>>> 6a9198745ad4aeaac08f094cc2d989de31863c9a

export default router;
