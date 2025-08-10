// server/routes/productRoutes.js
const express = require('express');
const productCtrl = require('../controllers/productController');
const { authMiddleware, permit } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

router.get('/', productCtrl.getProducts);
router.get('/:id', productCtrl.getProduct);
router.post('/', authMiddleware, permit('admin'), upload.single('image'), productCtrl.createProduct);
router.put('/:id', authMiddleware, permit('admin'), upload.single('image'), productCtrl.updateProduct);
router.delete('/:id', authMiddleware, permit('admin'), productCtrl.deleteProduct);

module.exports = router;
