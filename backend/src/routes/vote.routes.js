import express from "express";
import {
  castVote,
  getProposalVotes
} from "../controllers/vote.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { isMainAdmin } from "../middlewares/role.middleware.js";

const router = express.Router();

/*
Main Admin votes on proposal
*/
router.post("/:proposalId", protect, isMainAdmin, castVote);

/*
Get voting results for a proposal
Main Admin only
*/
router.get("/proposal/:proposalId", protect, isMainAdmin, getProposalVotes);

export default router;