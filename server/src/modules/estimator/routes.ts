import { Router } from 'express';
import { getEstimate } from './controller.js';

const router = Router();

// POST /api/estimate
router.post('/', getEstimate);

export default router;