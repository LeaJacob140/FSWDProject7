const pool = require('../config/db');
const productModel = require('../models/productModel');

// Get all products (public)
const getAllProducts = async (req, res) => {
  try {
    const [products] = await pool.query('SELECT * FROM products');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get product by ID (public)
const getProductById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new product (admin only)
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category_id } = req.body;
    const image = req.file?`/uploads/${req.file.filename}` : null;

    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);

    if (!name || !description || !price || !stock || !category_id || !image) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const id = await productModel.createProduct({
      name,
      description,
      price,
      stock,
      category_id,
      image,
    });

    res.status(201).json({ message: 'Product added successfully', id });
  } catch (err) {
    console.error("Create product error:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update product (admin only)
const updateProduct = async (req, res) => {
  const { name, description, price, stock, category_id } = req.body;
  const image = req.file?.filename;

  try {
    const [result] = await pool.query(
      `UPDATE products
       SET name = ?, description = ?, price = ?, stock = ?, category_id = ?, image = IFNULL(?, image), updated_at = NOW()
       WHERE id = ?`,
      [name, description, price, stock, category_id, image || null, req.params.id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Product not found or no changes' });

    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete product (admin only)
const deleteProduct = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Product not found' });

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
