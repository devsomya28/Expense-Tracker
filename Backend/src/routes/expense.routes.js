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

router.use(authMiddleware);

router.post("/", addExpenseController);

router.get("/", getAllExpensesController);

router.get("/:id", getSingleExpenseController);

router.put("/:id", editExpenseController);

router.delete("/:id", deleteExpenseController);

export default router;