import express from "express";

import {
  addIncomeController,
  getIncomeController,
} from "../controllers/income.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", addIncomeController);

router.get("/", getIncomeController);

export default router;