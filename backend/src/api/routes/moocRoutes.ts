import { Router } from 'express';
import { submitMoocEvidence, getAllMoocSubmissions, updateMoocStatus } from '../controllers/moocController';
import { protect, restrictTo } from '../middlewares/auth';

const router = Router();

router.use(protect);

router.post('/submit', submitMoocEvidence);
router.get('/', getAllMoocSubmissions);
router.patch('/:id/status', restrictTo('SCHOOL_LEADER', 'ADMIN', 'MANAGEMENT', 'SUPER_ADMIN'), updateMoocStatus);

export default router;
