const notificationModel = require('../models/notificationModel');

const getNotifications = async (req, res) => {
  try {
    const notifications = await notificationModel.getUserNotifications(req.user.id);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const markNotificationRead = async (req, res) => {
  try {
    const id = req.params.id;
    await notificationModel.markAsRead(id);
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getNotifications,
  markNotificationRead,
};
