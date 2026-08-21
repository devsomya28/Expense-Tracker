import express from "express";
import {
  loginController,
  registerController,getMeController,
  logoutController,
} from "../controllers/auth.controller.js";

const router = express.Router();

// Register
router.post("/register", registerController);

// Login
router.post("/login", loginController);

router.get("/me", getMeController);

// Logout
router.post("/logout", logoutController);

export default router;