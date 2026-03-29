import Notification from "../models/notification.model.js";

export const checkNotificationOwner = async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return res.status(404).json({ message: "Notification not found" });
  }

  if (
    notification.receiver.toString() !== req.user.id ||
    notification.receiverModel !== req.user.role
  ) {
    return res.status(403).json({
      message: "Access denied"
    });
  }

  req.notification = notification;
  next();
};