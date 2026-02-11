import { Router } from 'express';
import { getObservations, createObservation } from '../controllers/observationController';

const router = Router();

router.get('/', getObservations);
router.post('/', createObservation);

export default router;
