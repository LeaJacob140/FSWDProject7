const pool = require('../config/db');

async function createOrder(userId, totalPrice, status = 'pending') {
  const [result] = await pool.query(
    'INSERT INTO orders (user_id, total_price, status, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
    [userId, totalPrice, status]
  );
  return result.insertId;
}

async function addOrderItem(orderId, productId, quantity, price) {
  await pool.query(
    'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
    [orderId, productId, quantity, price]
  );
}

async function getOrdersByUser(userId) {
  const [rows] = await pool.query('SELECT * FROM orders WHERE user_id = ?', [userId]);
  return rows;
}

async function getOrderItems(orderId) {
  const [rows] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [orderId]);
  return rows;
}

module.exports = {
  createOrder,
  addOrderItem,
  getOrdersByUser,
  getOrderItems,
};
