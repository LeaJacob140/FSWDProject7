const pool = require('../config/db');

async function findUserByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
}

async function createUser({ name, email, password, role = 'user' }) {
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password, role, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
    [name, email, password, role]
  );
  return result.insertId;
}

async function findUserById(id) {
  const [rows] = await pool.query('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [id]);
  return rows[0];
}

module.exports = {
  findUserByEmail,
  createUser,
  findUserById,
};
