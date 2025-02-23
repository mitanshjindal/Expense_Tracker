const express = require('express');
const router = express.Router();
const { reqOTP, verifyOTP } = require('../controllers/otpController');

router.post('/reqOTP', reqOTP);
router.post('/verifyOTP', verifyOTP);

module.exports = router;

