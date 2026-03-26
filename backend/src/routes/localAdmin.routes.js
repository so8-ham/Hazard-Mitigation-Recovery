import express from "express";
import {
  getLocalAdminProfile,
  updateLocalAdminProfile,
  deleteLocalAdminAccount
} from "../controllers/localAdmin.controller.js";

import { protectLocalAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();


// View Profile
router.get("/profile", protectLocalAdmin, getLocalAdminProfile);

// Update Profile
router.put("/profile", protectLocalAdmin, updateLocalAdminProfile);

// Delete Account
router.delete("/delete-account", protectLocalAdmin, deleteLocalAdminAccount);


export default router;