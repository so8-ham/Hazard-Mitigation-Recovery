import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    proposal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proposal",
      required: true
    },

    votedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MainAdmin",
      required: true
    },

    vote: {
      type: String,
      enum: ["YES", "NO"],
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Prevent double voting
voteSchema.index({ proposal: 1, votedBy: 1 }, { unique: true });

export default mongoose.model("Vote", voteSchema);