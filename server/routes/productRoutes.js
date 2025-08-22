const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { authMiddleware, permit } = require('../middleware/auth');

// import controller functions
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// Routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', authMiddleware, permit('admin'), upload.single('image'), createProduct);
router.put('/:id', authMiddleware, permit('admin'), updateProduct);
router.delete('/:id', authMiddleware, permit('admin'), deleteProduct);

module.exports = router;
