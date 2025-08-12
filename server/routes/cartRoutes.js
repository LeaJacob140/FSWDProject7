const express = require('express');
const cartController = require('../controllers/cartController');
const { authMiddleware, permit }  = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, cartController.getCart);
router.post('/', authMiddleware, cartController.addToCart);
router.delete('/:id', authMiddleware, cartController.removeFromCart);
router.delete('/', authMiddleware, cartController.clearCart);

module.exports = router;
