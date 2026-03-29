import Proposal from "../models/proposal.model.js";
import Notification from "../models/notification.model.js";
import MainAdmin from "../models/mainadmin.model.js";

/*
CREATE PROPOSAL
Local Admin sends proposal to Main Admin
*/
export const createProposal = async (req, res) => {
  try {
    const { title, description, data, rewardAmount } = req.body;

    const proposal = await Proposal.create({
      title,
      description,
      data,
      rewardAmount,
      createdBy: req.user.id
    });

    // find all main admins
    const mainAdmins = await MainAdmin.find();

    // send notification to each main admin
    const notifications = mainAdmins.map((admin) => ({
      receiver: admin._id,
      receiverModel: "MainAdmin",
      sender: req.user.id,
      senderModel: "LocalAdmin",
      title: "New Proposal Submitted",
      message: `A new proposal requires your vote`,
      type: "NEW_PROPOSAL",
      proposal: proposal._id
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({
      success: true,
      message: "Proposal submitted successfully",
      proposal
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
GET MY PROPOSALS
Only Local Admin
*/
export const getMyProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find({
      createdBy: req.user.id
    }).sort({ createdAt: -1 });

    res.json(proposals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
GET ALL PROPOSALS
Main Admin only
*/
export const getAllProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(proposals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
GET SINGLE PROPOSAL
Security included
*/
export const getProposalById = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id)
      .populate("createdBy", "name email");

    if (!proposal) {
      return res.status(404).json({
        message: "Proposal not found"
      });
    }

    // SECURITY CHECK
    if (
      req.user.role === "LocalAdmin" &&
      proposal.createdBy._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: "You cannot access this proposal"
      });
    }

    res.json(proposal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};