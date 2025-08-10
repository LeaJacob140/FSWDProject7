// server/middleware/auth.js
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
require('dotenv').config();

async function authMiddleware(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ message: 'No authorization header' });
  const parts = header.split(' ');
  if (parts.length !== 2) return res.status(401).json({ message: 'Token error' });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await pool.query('SELECT id, username, email, role FROM users WHERE id = ?', [payload.id]);
    if (!rows.length) return res.status(401).json({ message: 'User not found' });
    req.user = rows[0];
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token', error: err.message });
  }
}

const permit = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden: insufficient rights' });
  next();
};

module.exports = { authMiddleware, permit };
