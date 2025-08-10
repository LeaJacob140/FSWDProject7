// server/controllers/orderController.js
const pool = require('../config/db');

const createOrder = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const userId = req.user.id;

    const [cart] = await conn.query(
      `SELECT ci.product_id, ci.quantity, p.price, p.stock
       FROM cart_items ci JOIN products p ON p.id = ci.product_id
       WHERE ci.user_id = ?`, [userId]
    );
    if (cart.length === 0) {
      await conn.rollback();
      conn.release();
      return res.status(400).json({ message: 'Cart empty' });
    }

    let total = 0;
    for (const item of cart) {
      if (item.stock < item.quantity) {
        await conn.rollback();
        conn.release();
        return res.status(400).json({ message: `Not enough stock for product ${item.product_id}` });
      }
      total += Number(item.price) * Number(item.quantity);
    }

    const [orderRes] = await conn.query('INSERT INTO orders (user_id, total_price) VALUES (?, ?)', [userId, total]);
    const orderId = orderRes.insertId;

    for (const item of cart) {
      await conn.query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)', [orderId, item.product_id, item.quantity, item.price]);
      await conn.query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.product_id]);
    }

    await conn.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);

    await conn.commit();
    res.status(201).json({ orderId, total });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: err.message });
  } finally {
    conn.release();
  }
};

const getOrdersForUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const [orders] = await pool.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createOrder, getOrdersForUser };
