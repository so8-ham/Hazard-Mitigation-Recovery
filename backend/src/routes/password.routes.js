import express from "express";
import {
  registerMainAdmin,
  loginAdmin,
  forgotPassword,
  verifyOTP,
  resetPassword
} from "../controllers/auth.controller.js";

const router = express.Router();


// Register Main Admin
router.post("/register-main-admin", registerMainAdmin);

// Login (Main Admin + Local Admin)
router.post("/login", loginAdmin);


// Forgot Password
router.post("/forgot-password", forgotPassword);
 
// Verify OTP
router.post("/verify-otp", verifyOTP);

// Reset Password
router.post("/reset-password", resetPassword);


export default router;