import express from "express";

import {
  addExpenseController,
  editExpenseController,
  deleteExpenseController,
  getAllExpensesController,
  getSingleExpenseController,
} from "../controllers/expense.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// All expense routes require authentication
router.use(authMiddleware);

// Add expense
router.post("/", addExpenseController);

// Get all expenses
router.get("/", getAllExpensesController);

// Get single expense
router.get("/:id", getSingleExpenseController);

// Edit expense
router.put("/:id", editExpenseController);

// Delete expense
router.delete("/:id", deleteExpenseController);

export default router;