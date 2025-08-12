const express = require('express');
const notificationController = require('../controllers/notificationController');
const { authMiddleware, permit }  = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, notificationController.getNotifications);
router.put('/:id/read', authMiddleware, notificationController.markNotificationRead);

module.exports = router;
