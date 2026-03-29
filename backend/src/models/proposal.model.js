import mongoose from "mongoose";

const proposalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    data: {
      type: Object, // any additional data sent by local admin
      default: {}
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LocalAdmin",
      required: true
    },

    // proposal status
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING"
    },

    // voting summary
    votesYes: {
      type: Number,
      default: 0
    },

    votesNo: {
      type: Number,
      default: 0
    },

    totalVotesRequired: {
      type: Number,
      default: 0
    },

    votedBy: [
      {
        admin: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MainAdmin"
        },
        vote: {
          type: String,
          enum: ["YES", "NO"]
        }
      }
    ],

    // money to send after approval
    rewardAmount: {
      type: Number,
      required: true
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PROCESSING", "PAID"],
      default: "PENDING"
    },

    approvedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

export default mongoose.model("Proposal", proposalSchema);