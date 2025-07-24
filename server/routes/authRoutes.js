// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// ✅ Forgot Password
router.post('/forgot-password', authController.forgotPassword);

// ✅ Reset Password (now uses userId from URL)
router.post('/reset-password/:userId', authController.resetPassword);

// ✅ Existing Routes
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.get('/users', authController.getAllUsers);

module.exports = router;
