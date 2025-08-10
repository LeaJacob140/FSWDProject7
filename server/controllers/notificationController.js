// server/controllers/notificationController.js
const pool = require('../config/db');

const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const id = req.params.id;
    await pool.query('UPDATE notifications SET is_read = 1 WHERE id = ?', [id]);
    res.json({ message: 'Marked' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getNotifications, markAsRead };
