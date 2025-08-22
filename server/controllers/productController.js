// const productModel = require('../models/productModel');
// const multer = require('multer');

// const path = require('path');

// // Configure multer storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Make sure this folder exists
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage });

// const getAllProducts = async (req, res) => {
//   try {
//     const products = await productModel.getAllProducts();
//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// const getProductById = async (req, res) => {
//   try {
//     const product = await productModel.getProductById(req.params.id);
//     if (!product) return res.status(404).json({ message: 'Product not found' });
//     res.json(product);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// const createProduct = async (req, res) => {
//   try {
//     const { name, price } = req.body;
//     const image = req.file ? req.file.filename : null;

//     const id = await productModel.createProduct({ name, price, image });
//     res.status(201).json({ message: 'Product created', id });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };



// const updateProduct = async (req, res) => {
//   try {
//     const affectedRows = await productModel.updateProduct(req.params.id, req.body);
//     if (!affectedRows) return res.status(404).json({ message: 'Product not found or no changes' });
//     res.json({ message: 'Product updated' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// const deleteProduct = async (req, res) => {
//   try {
//     const affectedRows = await productModel.deleteProduct(req.params.id);
//     if (!affectedRows) return res.status(404).json({ message: 'Product not found' });
//     res.json({ message: 'Product deleted' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// module.exports = {
//   getAllProducts,
//   getProductById,
//   createProduct,
//   updateProduct,
//   deleteProduct,
// };
// controllers/productController.js
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
    const image = req.file?.filename;

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
