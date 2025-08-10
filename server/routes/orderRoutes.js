// server/routes/orderRoutes.js
const express = require('express');
const orderCtrl = require('../controllers/orderController');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

router.post('/', authMiddleware, orderCtrl.createOrder);
router.get('/', authMiddleware, orderCtrl.getOrdersForUser);

module.exports = router;
