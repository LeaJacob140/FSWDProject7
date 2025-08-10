// server/scripts/seed-admin.js
const pool = require('../config/db');
const bcrypt = require('bcrypt');

async function seed() {
  const username = 'admin';
  const email = 'admin@example.com';
  const password = 'AdminPass123'; // שנה מיידית
  const role = 'admin';
  try {
    const hash = await bcrypt.hash(password, 10);
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ? OR username = ?', [email, username]);
    if (existing.length) {
      console.log('Admin already exists');
      process.exit(0);
    }
    const [res] = await pool.query('INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)', [username, email, hash, role]);
    console.log('Admin created with id', res.insertId, 'username:', username, 'password:', password);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
