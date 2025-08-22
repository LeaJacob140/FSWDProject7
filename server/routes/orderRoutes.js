const express = require('express');
const orderController = require('../controllers/orderController');
const { authMiddleware, permit } = require('../middleware/auth');

const router = express.Router();

// POST /api/orders -> place order
router.post("/", authMiddleware, orderController.placeOrder);

// GET /api/orders -> get user orders
router.get("/", authMiddleware, orderController.getUserOrders);

// GET /api/orders/:orderId/items -> get items for a specific order
router.get("/:orderId/items", authMiddleware, orderController.getOrderItems);

module.exports = router;
