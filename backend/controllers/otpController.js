const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const User = require('../models/User');

const otpCache = {};

function generateOTP() {
  return randomstring.generate({ length: 4, charset: 'numeric' });
}

function sendOTP(email, otp) {
  const mailOptions = {
    from: 'chomalmedha@gmail.com',
    to: email,
    subject: 'OTP Verification',
    text: `Your OTP for verification is: ${otp}`
  };

  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'chomalmedha@gmail.com',
      pass: 'sebl epvb gzeg xako'
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error occurred:', error);
    } else {
      console.log('OTP Email sent successfully:', info.response);
    }
  });
}

exports.reqOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isAdmin) {
      return res.status(400).json({ message: 'Admin users do not require OTP' });
    }

    const otp = generateOTP();
    otpCache[email] = otp;

    sendOTP(email, otp);
    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.verifyOTP = (req, res) => {
  const { email, otp } = req.body;

  if (!otpCache.hasOwnProperty(email)) {
    return res.status(400).json({ message: 'Email not found or OTP expired' });
  }

  if (otpCache[email] === otp.trim()) {
    delete otpCache[email];
    return res.json({ message: 'OTP verified' });
  } else {
    return res.status(400).json({ message: 'Invalid OTP' });
  }
};

