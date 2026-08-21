import express from "express";

import {
  createAccountController,
  getAccountsController,
} from "../controllers/account.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createAccountController);

router.get("/", getAccountsController);

export default router;