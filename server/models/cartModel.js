const pool = require('../config/db');

async function getCartItems(userId) {
  const [rows] = await pool.query(
    `SELECT ci.id, ci.product_id, ci.quantity, p.name, p.price, p.image
     FROM cart_items ci
     JOIN products p ON ci.product_id = p.id
     WHERE ci.user_id = ?`,
    [userId]
  );
  return rows;
}

async function addToCart(userId, productId, quantity = 1) {
  // 1. Check current stock
  const [productRows] = await pool.query('SELECT stock FROM products WHERE id = ?', [productId]);
  if (!productRows.length) throw new Error('Product not found');

  const currentStock = productRows[0].stock;
  console.log(`Current stock for product ${productId}: ${currentStock}`);
  if (currentStock < quantity) {
    return { success: false, message: 'Not enough stock' }; // <-- return, don’t throw
  }
  // 2. Check if item is already in cart
  const [existing] = await pool.query(
    'SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?',
    [userId, productId]
  );

  if (existing.length) {
    const newQty = existing[0].quantity + quantity;
    await pool.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [newQty, existing[0].id]);
  } else {
    await pool.query(
      'INSERT INTO cart_items (user_id, product_id, quantity, added_at) VALUES (?, ?, ?, NOW())',
      [userId, productId, quantity]
    );
  }

  // 3. Update stock in products table
  await pool.query('UPDATE products SET stock = stock - ? WHERE id = ?', [quantity, productId]);
  console.log(`Current stock for product ${productId}: ${currentStock}`);
  return { success: true };
}


async function removeFromCart(cartItemId) {
  // 1. Get cart item quantity and product ID
  const [rows] = await pool.query('SELECT product_id, quantity FROM cart_items WHERE id = ?', [cartItemId]);
  if (!rows.length) throw new Error('Cart item not found');

  const { product_id, quantity } = rows[0];

  // 2. Delete from cart
  const [result] = await pool.query('DELETE FROM cart_items WHERE id = ?', [cartItemId]);

  // 3. Restore stock
  await pool.query('UPDATE products SET stock = stock + ? WHERE id = ?', [quantity, product_id]);

  return result.affectedRows;
}


async function clearCart(userId) {
  // 1. Get all cart items
  const [cartItems] = await pool.query('SELECT product_id, quantity FROM cart_items WHERE user_id = ?', [userId]);

  // 2. Restore stock for each item
  for (const item of cartItems) {
    await pool.query('UPDATE products SET stock = stock + ? WHERE id = ?', [item.quantity, item.product_id]);
  }

  // 3. Clear the cart
  await pool.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);
}


module.exports = {
  getCartItems,
  addToCart,
  removeFromCart,
  clearCart,
};
