import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    // Proposal related to payment
    proposal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proposal",
      required: true
    },

    // Local Admin receiving money
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LocalAdmin",
      required: true,
      index: true
    },

    // Main Admin who approved payment
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MainAdmin"
    },

    amount: {
      type: Number,
      required: true,
      min: 0
    },

    currency: {
      type: String,
      default: "INR"
    },

    // Bank transfer details
    paymentMethod: {
      type: String,
      enum: ["BANK_TRANSFER", "UPI", "MANUAL"],
      default: "BANK_TRANSFER"
    },

    transactionId: {
      type: String,
      unique: true
    },

    bankReferenceNumber: {
      type: String
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "PROCESSING",
        "SUCCESS",
        "FAILED"
      ],
      default: "PENDING"
    },

    failureReason: {
      type: String
    },

    processedAt: {
      type: Date
    },

    // Security logs
    initiatedBySystem: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Index for faster queries
transactionSchema.index({ proposal: 1 });
transactionSchema.index({ status: 1 });

// Prevent duplicate transaction for same proposal
transactionSchema.index({ proposal: 1 }, { unique: true });

export default mongoose.model("Transaction", transactionSchema);