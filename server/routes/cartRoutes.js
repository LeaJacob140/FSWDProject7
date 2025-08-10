// server/routes/cartRoutes.js
const express = require('express');
const cartCtrl = require('../controllers/cartController');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

router.get('/', authMiddleware, cartCtrl.getCart);
router.post('/', authMiddleware, cartCtrl.addToCart);
router.put('/:id', authMiddleware, cartCtrl.updateCartItem);
router.delete('/:id', authMiddleware, cartCtrl.removeCartItem);

module.exports = router;
