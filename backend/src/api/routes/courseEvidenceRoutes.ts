import { Router } from 'express';
import { protect } from '../middlewares/auth';
import { getAllEvidence, submitEvidence } from '../controllers/courseEvidenceController';

const router = Router();

// All course evidence routes are protected
router.use(protect);

router.get('/', getAllEvidence);
router.post('/', submitEvidence);

export default router;
