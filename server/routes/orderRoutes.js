const express = require('express');
const orderController = require('../controllers/orderController');
const { authMiddleware, permit } = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, orderController.placeOrder);
router.get('/', authMiddleware, orderController.getUserOrders);

module.exports = router;
