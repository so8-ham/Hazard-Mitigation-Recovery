import express from "express";
import {
  getMyNotifications,
  markAsRead,
  deleteNotification
} from "../controllers/notification.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { checkNotificationOwner } from "../middlewares/notificationOwnership.middleware.js";

const router = express.Router();

/*
Get logged-in admin notifications
*/
router.get("/my", protect, getMyNotifications);

/*
Mark notification as read
*/
router.put("/read/:id", protect, checkNotificationOwner, markAsRead);

/*
Delete notification
*/
router.delete("/delete/:id", protect, checkNotificationOwner, deleteNotification);

export default router;