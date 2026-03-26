import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },

    role: {
      type: String,
      required: true,
      enum: ["MAIN_ADMIN", "LOCAL_ADMIN"]
    },

    otp: {
      type: String,
      required: true
    },

    expiresAt: {
      type: Date,
      required: true
    },

    isVerified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;