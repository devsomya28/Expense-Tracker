import express from 'express';
import { askQuestion, parseExpense, analyzeFinancialSpendingController } from '../controllers/ai.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { requireAiQuota } from '../middleware/entitlement.middleware.js';

const router = express.Router();

router.get('/spending-analysis', protect, requireAiQuota, analyzeFinancialSpendingController);
router.post('/ask', protect, requireAiQuota, askQuestion);
router.post('/parse-expense', protect, requireAiQuota, parseExpense);

export default router;