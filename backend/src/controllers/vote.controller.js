import Vote from "../models/vote.model.js";
import Proposal from "../models/proposal.model.js";
import Transaction from "../models/transaction.model.js";
import Notification from "../models/notification.model.js";

/*
CAST VOTE
Main Admin votes YES / NO
*/
export const castVote = async (req, res) => {
  try {
    const { vote } = req.body;
    const { proposalId } = req.params;

    if (!vote || !["YES", "NO"].includes(vote)) {
      return res.status(400).json({
        message: "Vote must be YES or NO"
      });
    }

    const proposal = await Proposal.findById(proposalId);

    if (!proposal) {
      return res.status(404).json({
        message: "Proposal not found"
      });
    }

    if (proposal.status !== "PENDING") {
      return res.status(400).json({
        message: "Voting already finished"
      });
    }

    // prevent double voting
    const existingVote = await Vote.findOne({
      proposal: proposalId,
      votedBy: req.user.id
    });

    if (existingVote) {
      return res.status(400).json({
        message: "You already voted"
      });
    }

    // save vote
    await Vote.create({
      proposal: proposalId,
      votedBy: req.user.id,
      vote
    });

    // update proposal vote count
    if (vote === "YES") proposal.votesYes += 1;
    else proposal.votesNo += 1;

    await proposal.save();

    /*
    CHECK MAJORITY
    */
    const totalVotes = proposal.votesYes + proposal.votesNo;

    // simple majority rule
    if (proposal.votesYes >= 3) {
      proposal.status = "APPROVED";
      proposal.approvedAt = new Date();
      await proposal.save();

      /*
      CREATE TRANSACTION
      */
      await Transaction.create({
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
        title: "Proposal Approved",
        message: "Your proposal has been approved and payment sent",
        type: "PROPOSAL_APPROVED",
        proposal: proposal._id
      });
    }

    if (proposal.votesNo >= 3) {
      proposal.status = "REJECTED";
      await proposal.save();

      await Notification.create({
        receiver: proposal.createdBy,
        receiverModel: "LocalAdmin",
        title: "Proposal Rejected",
        message: "Your proposal has been rejected",
        type: "PROPOSAL_REJECTED",
        proposal: proposal._id
      });
    }

    res.json({
      success: true,
      message: "Vote submitted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
GET VOTES OF A PROPOSAL
*/
export const getProposalVotes = async (req, res) => {
  try {
    const { proposalId } = req.params;

    const votes = await Vote.find({
      proposal: proposalId
    }).populate("votedBy", "name email");

    const yesVotes = votes.filter(v => v.vote === "YES").length;
    const noVotes = votes.filter(v => v.vote === "NO").length;

    res.json({
      totalVotes: votes.length,
      yesVotes,
      noVotes,
      votes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};