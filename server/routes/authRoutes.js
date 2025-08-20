// server/routes/authRoutes.js
const express = require('express');
const { register, login, getProfile  } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getProfile); // <-- this is what your frontend calls


module.exports = router;
