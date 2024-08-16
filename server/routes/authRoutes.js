import express from "express";
import {
  signUp,
  signIn,
  logout,
  getCookies,
} from "../controllers/authController.js";
import passport from "passport";
import { getProfile, updateProfile } from "../controllers/profileController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/auth/signup", signUp);
router.post("/auth/signin", signIn);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.get("/getCookies", authMiddleware, getCookies);
router.post("/logout", logout);

export { router as authRouter };
