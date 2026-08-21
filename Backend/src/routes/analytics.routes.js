import express from "express";

import {
  getFinancialAnalyticsController,
} from "../controllers/analytics.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get(
  "/",
  getFinancialAnalyticsController
);
 
export default router;