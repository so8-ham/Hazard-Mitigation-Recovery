import MainAdmin from "../models/mainadmin.model.js";
import LocalAdmin from "../models/localadmin.model.js";
import OTP from "../models/otp.model.js";
import jwt from "jsonwebtoken";
// import sendEmail from "../utils/sendEmail.js";
import { sendOTPEmail } from "../config/mail.js";

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: "14d" }
  );
};



// ================= REGISTER MAIN ADMIN =================
export const registerMainAdmin = async (req, res) => {
  try {
    const { name, email, password, aadhaarNumber } = req.body;

    const existingAdmin = await MainAdmin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Main Admin already exists"
      });
    }

    const admin = await MainAdmin.create({
      name,
      email,
      password,
      aadhaarNumber
    });

    res.status(201).json({
      success: true,
      message: "Main Admin registered successfully",
      data: admin
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// ================= LOGIN =================
export const loginAdmin = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    let user;

    if (role === "MAIN_ADMIN") {
      user = await MainAdmin.findOne({ email });
    } else if (role === "LOCAL_ADMIN") {
      user = await LocalAdmin.findOne({ email });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid role"
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Account not found"
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = generateToken(user._id, role);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      role
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// ================= FORGOT PASSWORD =================
export const forgotPassword = async (req, res) => {
  try {
    const { email, role } = req.body;

    let user;

    if (role === "MAIN_ADMIN") {
      user = await MainAdmin.findOne({ email });
    } else if (role === "LOCAL_ADMIN") {
      user = await LocalAdmin.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Account not found"
      });
    }

    // Generate 4-digit OTP
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

    // Save OTP
    await OTP.create({
      email,
      role,
      otp: otpCode,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    });

    // Send Email
   await sendOTPEmail(email, otpCode);

    res.status(200).json({
      success: true,
      message: "OTP sent to email"
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// ================= VERIFY OTP =================
export const verifyOTP = async (req, res) => {
  try {
    const { email, role, otp } = req.body;

    const otpRecord = await OTP.findOne({
      email,
      role,
      otp
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired"
      });
    }

    otpRecord.isVerified = true;
    await otpRecord.save();

    res.status(200).json({
      success: true,
      message: "OTP verified successfully"
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// ================= RESET PASSWORD =================
export const resetPassword = async (req, res) => {
  try {
    const { email, role, newPassword } = req.body;

    const otpRecord = await OTP.findOne({
      email,
      role,
      isVerified: true
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "OTP not verified"
      });
    }

    let user;

    if (role === "MAIN_ADMIN") {
      user = await MainAdmin.findOne({ email });
    } else {
      user = await LocalAdmin.findOne({ email });
    }

    user.password = newPassword;
    await user.save();

    await OTP.deleteMany({ email });

    res.status(200).json({
      success: true,
      message: "Password reset successful"
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};