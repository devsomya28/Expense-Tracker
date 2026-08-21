import express from "express";

import {
  createSplitController,
  getSplitsController,
} from "../controllers/split.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createSplitController);

router.get("/", getSplitsController);

export default router;