const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createOrder, verifyPayment, checkPaymentStatus } = require('../controllers/paymentController');

router.post('/create-order', protect, createOrder);
router.post('/verify-payment', protect, verifyPayment);
router.get('/check-payment-status', protect, checkPaymentStatus);

module.exports = router;

