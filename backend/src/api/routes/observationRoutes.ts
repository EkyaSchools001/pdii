import { Router } from 'express';
import { getAllObservations, createObservation } from '../controllers/observationController';
import { protect, restrictTo } from '../middlewares/auth';

const router = Router();

router.use(protect); // Protect all observation routes

router.get('/', getAllObservations);
router.post('/', restrictTo('ADMIN', 'LEADER', 'SUPERADMIN'), createObservation);

export default router;
