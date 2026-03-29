import Notification from "../models/notification.model.js";

/*
GET MY NOTIFICATIONS
Only return notifications of logged-in admin
*/
export const getMyNotifications = async (req, res) => {
  try {
    const receiverModel = req.user.role === "MAIN_ADMIN" ? "MainAdmin" : "LocalAdmin";

    const notifications = await Notification.find({
      receiver: req.user.id,
      receiverModel: receiverModel,
      isDeleted: false
    })
      .sort({ createdAt: -1 })
      .populate("proposal", "title status");

    res.json({
      success: true,
      count: notifications.length,
      notifications
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
MARK NOTIFICATION AS READ
*/
export const markAsRead = async (req, res) => {
  try {
    const notification = req.notification;

    notification.isRead = true;
    notification.readAt = new Date();

    await notification.save();

    res.json({
      success: true,
      message: "Notification marked as read"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
DELETE NOTIFICATION (SOFT DELETE)
*/
export const deleteNotification = async (req, res) => {
  try {
    const notification = req.notification;

    notification.isDeleted = true;
    await notification.save();

    res.json({
      success: true,
      message: "Notification deleted"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};