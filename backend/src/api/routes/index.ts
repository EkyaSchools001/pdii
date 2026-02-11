import { Router } from 'express';
import observationRoutes from './observationRoutes';
import authRoutes from './authRoutes';
import goalRoutes from './goalRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/observations', observationRoutes);
router.use('/goals', goalRoutes);

export default router;
