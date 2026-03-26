import express from "express";
import {
  createLocalAdmin,
  getLocalAdmins,
  updateLocalAdmin,
  deleteLocalAdmin
} from "../controllers/mainAdmin.controller.js";
import { protectMainAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();


// Create Local Admin
router.post("/create-local-admin", protectMainAdmin, createLocalAdmin);

// Get all Local Admins
router.get("/local-admins", protectMainAdmin, getLocalAdmins);

// Update Local Admin
router.put("/local-admin/:id", protectMainAdmin, updateLocalAdmin);

// Delete Local Admin
router.delete("/local-admin/:id", protectMainAdmin, deleteLocalAdmin);


export default router;