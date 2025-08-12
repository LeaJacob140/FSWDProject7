const pool = require('../config/db');

async function getUserNotifications(userId) {
  const [rows] = await pool.query('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC', [userId]);
  return rows;
}

async function createNotification(userId, message) {
  await pool.query('INSERT INTO notifications (user_id, message, is_read, created_at) VALUES (?, ?, 0, NOW())', [userId, message]);
}

async function markAsRead(notificationId) {
  await pool.query('UPDATE notifications SET is_read = 1 WHERE id = ?', [notificationId]);
}

module.exports = {
  getUserNotifications,
  createNotification,
  markAsRead,
};
