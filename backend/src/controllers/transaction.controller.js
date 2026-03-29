import Transaction from "../models/transaction.model.js";
import Proposal from "../models/proposal.model.js";
import Notification from "../models/notification.model.js";

/*
CREATE PAYOUT
Main Admin triggers payment
*/
export const createPayout = async (req, res) => {
  try {
    const { proposalId } = req.params;

    const proposal = await Proposal.findById(proposalId);

    if (!proposal) {
      return res.status(404).json({
        message: "Proposal not found"
      });
    }

    if (proposal.status !== "APPROVED") {
      return res.status(400).json({
        message: "Proposal not approved yet"
      });
    }

    // Prevent duplicate transaction
    const existingTransaction = await Transaction.findOne({
      proposal: proposalId
    });

    if (existingTransaction) {
      return res.status(400).json({
        message: "Payment already processed"
      });
    }

    const transaction = await Transaction.create({
      proposal: proposal._id,
      receiver: proposal.createdBy,
      approvedBy: req.user.id,
      amount: proposal.rewardAmount,
      status: "SUCCESS",
      processedAt: new Date()
    });

    /*
    SEND NOTIFICATION TO LOCAL ADMIN
    */
    await Notification.create({
      receiver: proposal.createdBy,
      receiverModel: "LocalAdmin",
      title: "Payment Sent",
      message: "Your reward payment has been transferred",
      type: "PAYMENT_SENT",
      proposal: proposal._id
    });

    res.status(201).json({
      success: true,
      message: "Payment sent successfully",
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
GET ALL TRANSACTIONS
Main Admin only
*/
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("proposal", "title")
      .populate("receiver", "name email")
      .populate("approvedBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: transactions.length,
      transactions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
GET MY TRANSACTIONS
Local Admin sees only their payments
*/
export const getMyTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      receiver: req.user.id
    })
      .populate("proposal", "title status")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: transactions.length,
      transactions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};