import express from 'express';
import { getMySubscription, devUpgrade } from '../controllers/subscription.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/me', protect, getMySubscription);
router.post('/dev/upgrade', protect, devUpgrade); // DEMO ONLY

export default router;