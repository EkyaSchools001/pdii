import { Router } from 'express';
import observationRoutes from './observationRoutes';

const router = Router();

router.use('/observations', observationRoutes);

export default router;
