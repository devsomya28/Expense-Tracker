import express from 'express';
import { getOverview, getHealthScore } from '../controllers/intelligence.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { requireFeature } from '../middleware/entitlement.middleware.js';

const router = express.Router();

router.get('/overview', protect, getOverview);
router.get('/health-score', protect, requireFeature('financial_health'), getHealthScore);
export default router;