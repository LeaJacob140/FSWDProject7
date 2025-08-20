const express = require('express');
const productController = require('../controllers/productController');
const { authMiddleware, permit } = require('../middleware/auth');
const upload = require('../middleware/upload');


const router = express.Router();

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', authMiddleware, upload.single('image'), productController.createProduct);
router.put('/:id', authMiddleware, productController.updateProduct);
router.delete('/:id', authMiddleware, productController.deleteProduct);

module.exports = router;
