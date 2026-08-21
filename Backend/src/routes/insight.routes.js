import express from 'express';
import { getActiveInsights, getUnreadCount, updateInsightStatus } from '../controllers/insight.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protect, getActiveInsights);
router.get('/unread', protect, getUnreadCount);
router.patch('/:id/status', protect, updateInsightStatus);

export default router;