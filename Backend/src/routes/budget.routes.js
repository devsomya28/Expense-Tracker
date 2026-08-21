import express from "express";

import {
  setMonthlyBudgetController,
} from "../controllers/budget.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.put(
  "/",
  setMonthlyBudgetController
);

export default router;