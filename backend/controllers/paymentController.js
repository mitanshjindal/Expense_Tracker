const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');

const razorpay = new Razorpay({
  key_id: 'rzp_test_jnFll4vBKCwPho',
  key_secret: "rj1C0dsKibu56PiiOhUqdGFp"
});

exports.createOrder = async (req, res) => {
  try {
    const options = {
      amount: 20000, 
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256","rj1C0dsKibu56PiiOhUqdGFp" )
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      
      await User.findByIdAndUpdate(req.user.id, { hasPaid: true, paymentDate: Date.now() });
      return res.status(200).json({ message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

exports.checkPaymentStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ hasPaid: user.hasPaid });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

