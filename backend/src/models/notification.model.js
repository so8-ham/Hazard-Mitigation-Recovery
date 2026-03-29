import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    // Who receives the notification
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "receiverModel",
      index: true
    },

    // Receiver role (security layer)
    receiverModel: {
      type: String,
      required: true,
      enum: ["MainAdmin", "LocalAdmin"]
    },

    // Who sent the notification
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "senderModel",
      default: null
    },

    senderModel: {
      type: String,
      enum: ["MainAdmin", "LocalAdmin"],
      default: null
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    message: {
      type: String,
      required: true
    },

    type: {
      type: String,
      enum: [
        "NEW_PROPOSAL",
        "VOTE_UPDATE",
        "PROPOSAL_APPROVED",
        "PROPOSAL_REJECTED",
        "PAYMENT_SENT"
      ],
      required: true
    },

    proposal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proposal"
    },

    // Read protection
    isRead: {
      type: Boolean,
      default: false
    },

    // Security tracking
    readAt: {
      type: Date
    },

    // Prevent modification after deletion
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Security Indexes
notificationSchema.index({ receiver: 1, receiverModel: 1 });
notificationSchema.index({ createdAt: -1 });

// Prevent updating receiver after creation
notificationSchema.pre("save", function (next) {
  if (!this.isNew) {
    if (this.isModified("receiver") || this.isModified("receiverModel")) {
      return next(new Error("Receiver cannot be changed"));
    }
  }
  next();
});

export default mongoose.model("Notification", notificationSchema);