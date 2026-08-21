import express from "express";

import {
  analyzeFinancialSpendingController,
  askFinancialQuestionController,
} from "../controllers/ai.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get(
  "/spending-analysis",
  analyzeFinancialSpendingController
);

router.post(
  "/ask",
  askFinancialQuestionController
);

export default router;