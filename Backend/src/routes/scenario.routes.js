import express from 'express';
import { simulate } from '../controllers/scenario.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { requireFeature } from '../middleware/entitlement.middleware.js';

const router = express.Router();

router.post('/simulate', protect, requireFeature('scenario_simulator'), simulate);
export default router;