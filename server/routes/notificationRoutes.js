// server/routes/notificationRoutes.js
const express = require('express');
const notifCtrl = require('../controllers/notificationController');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

router.get('/', authMiddleware, notifCtrl.getNotifications);
router.put('/:id/read', authMiddleware, notifCtrl.markAsRead);

module.exports = router;
