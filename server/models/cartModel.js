const pool = require('../config/db');

async function getCartItems(userId) {
  const [rows] = await pool.query(
    `SELECT cart_items.id, product_id, quantity, products.name, products.price, products.image 
    FROM cart_items 
    JOIN products ON cart_items.product_id = products.id 
    WHERE user_id = ?`, 
    [userId]
  );
  return rows;
}

async function addToCart(userId, productId, quantity = 1) {
  // בדיקה אם כבר קיים
  const [existing] = await pool.query('SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?', [userId, productId]);
  if (existing.length) {
    // עדכון כמות
    const newQty = existing[0].quantity + quantity;
    await pool.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [newQty, existing[0].id]);
  } else {
    // הוספה חדשה
    await pool.query('INSERT INTO cart_items (user_id, product_id, quantity, added_at) VALUES (?, ?, ?, NOW())', [userId, productId, quantity]);
  }
}

async function removeFromCart(cartItemId) {
  const [result] = await pool.query('DELETE FROM cart_items WHERE id = ?', [cartItemId]);
  return result.affectedRows;
}

async function clearCart(userId) {
  await pool.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);
}

module.exports = {
  getCartItems,
  addToCart,
  removeFromCart,
  clearCart,
};
