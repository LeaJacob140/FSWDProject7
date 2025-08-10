// server/controllers/cartController.js
const pool = require('../config/db');

const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      `SELECT ci.id, ci.quantity, p.id as product_id, p.name, p.price, p.image
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.user_id = ?`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity } = req.body;
    const q = Math.max(1, Number(quantity) || 1);
    await pool.query(
      `INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
      [userId, product_id, q]
    );
    res.json({ message: 'Added to cart' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const id = req.params.id;
    const { quantity } = req.body;
    await pool.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, id]);
    res.json({ message: 'Updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const removeCartItem = async (req, res) => {
  try {
    const id = req.params.id;
    await pool.query('DELETE FROM cart_items WHERE id = ?', [id]);
    res.json({ message: 'Removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem };
