const pool = require('../config/db');

async function getAllProducts() {
  const [rows] = await pool.query('SELECT * FROM products');
  return rows;
}

async function getProductById(id) {
  const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
  return rows[0];
}

async function createProduct({ name, description, price, stock, category_id, image }) {
  const [result] = await pool.query(
    'INSERT INTO products (name, description, price, stock, category_id, image, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
    [name, description, price, stock, category_id, image]
  );
  return result.insertId;
}

async function updateProduct(id, fields) {
  const setString = Object.keys(fields).map(key => `${key} = ?`).join(', ');
  const values = Object.values(fields);
  values.push(id);
  const [result] = await pool.query(`UPDATE products SET ${setString}, updated_at = NOW() WHERE id = ?`, values);
  return result.affectedRows;
}

async function deleteProduct(id) {
  const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
  return result.affectedRows;
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
