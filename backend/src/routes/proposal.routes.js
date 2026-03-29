import express from "express";
import {
  createProposal,
  getMyProposals,
  getAllProposals,
  getProposalById
} from "../controllers/proposal.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { isMainAdmin, isLocalAdmin } from "../middlewares/role.middleware.js";

const router = express.Router();

/*
Local Admin sends proposal to Main Admin
*/
router.post("/create", protect, isLocalAdmin, createProposal);

/*
Local Admin can see only their proposals
*/
router.get("/my-proposals", protect, isLocalAdmin, getMyProposals);

/*
Main Admin can see all proposals
*/
router.get("/all", protect, isMainAdmin, getAllProposals);

/*
Get proposal details
(Local admin → only their proposal
Main admin → any proposal)
*/
router.get("/:id", protect, getProposalById);

export default router;