// server/controllers/productController.js
const pool = require('../config/db');

const getProducts = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id ORDER BY p.created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ message: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category_id } = req.body;
    const image = req.file ? req.file.filename : null;
    const [resInsert] = await pool.query(
      'INSERT INTO products (name, description, price, stock, category_id, image) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description || null, price || 0, stock || 0, category_id || null, image]
    );
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [resInsert.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, description, price, stock, category_id } = req.body;
    const image = req.file ? req.file.filename : null;
    const fields = [];
    const values = [];
    if (name) { fields.push('name = ?'); values.push(name); }
    if (description) { fields.push('description = ?'); values.push(description); }
    if (price !== undefined) { fields.push('price = ?'); values.push(price); }
    if (stock !== undefined) { fields.push('stock = ?'); values.push(stock); }
    if (category_id !== undefined) { fields.push('category_id = ?'); values.push(category_id); }
    if (image) { fields.push('image = ?'); values.push(image); }
    if (!fields.length) return res.status(400).json({ message: 'No updates sent' });

    values.push(id);
    const sql = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;
    await pool.query(sql, values);
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    await pool.query('DELETE FROM products WHERE id = ?', [id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
