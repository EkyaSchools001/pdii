import { Router } from 'express';
import { getAllTrainingEvents, createTrainingEvent, registerForEvent, updateEventStatus } from '../controllers/trainingController';
import { protect, restrictTo } from '../middlewares/auth';

const router = Router();

router.use(protect);

router.get('/', getAllTrainingEvents);
router.post('/', restrictTo('SCHOOL_LEADER', 'ADMIN', 'MANAGEMENT', 'SUPER_ADMIN'), createTrainingEvent);
router.post('/:eventId/register', registerForEvent);
router.patch('/:id/status', restrictTo('SCHOOL_LEADER', 'ADMIN', 'MANAGEMENT', 'SUPER_ADMIN'), updateEventStatus);

export default router;
