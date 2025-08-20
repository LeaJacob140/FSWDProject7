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
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const multer = require('multer');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Middleware to check JWT and admin role
const adminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Add product route
router.post('/', adminAuth, upload.single('image'), async (req, res) => {
  const { name, price } = req.body;
  const image = req.file?.filename;

  if (!name || !price || !image) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    await pool.query(
      'INSERT INTO products (name, price, image) VALUES (?, ?, ?)',
      [name, price, image]
    );
    res.status(201).json({ message: 'Product added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
