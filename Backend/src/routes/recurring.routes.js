import express from "express";

import {
  createRecurringController,
  getRecurringController,
  deleteRecurringController,
} from "../controllers/recurring.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createRecurringController);

router.get("/", getRecurringController);

router.delete("/:id", deleteRecurringController);

export default router;