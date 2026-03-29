import express from "express";
import {
  createPayout,
  getAllTransactions,
  getMyTransactions
} from "../controllers/transaction.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { isMainAdmin, isLocalAdmin } from "../middlewares/role.middleware.js";

const router = express.Router();

/*
Trigger payout after proposal approval
Only Main Admin
*/
router.post("/payout/:proposalId", protect, isMainAdmin, createPayout);

/*
View all transactions
Main Admin only
*/
router.get("/all", protect, isMainAdmin, getAllTransactions);

/*
Local Admin sees their payment history
*/
router.get("/my-transactions", protect, isLocalAdmin, getMyTransactions);

export default router;