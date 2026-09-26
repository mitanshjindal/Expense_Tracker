const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const User = require('../models/User');

// In-memory OTP cache: { [email]: { otp: string, createdAt: number } }
const otpCache = {};
const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

function generateOTP() {
  return randomstring.generate({ length: 4, charset: 'numeric' });
}

async function sendOTP(email, otp) {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    console.log('\n⚠️ [OTP System] EMAIL_USER or EMAIL_PASS not configured in backend/.env.');
    console.log(`🔑 [Dev Fallback] Email: ${email} | OTP: ${otp}\n`);
    return { success: false, reason: 'EMAIL_CREDENTIALS_MISSING' };
  }

  const mailOptions = {
    from: `"FinTrack" <${emailUser}>`,
    to: email,
    subject: 'Your FinTrack Verification Code',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 24px; background-color: #0f172a; color: #f8fafc;">
        <div style="max-width: 480px; margin: auto; background-color: #1e293b; padding: 32px; border-radius: 12px; border: 1px solid #334155;">
          <h2 style="color: #38bdf8; margin-top: 0; font-size: 24px; font-weight: 700;">FinTrack Verification</h2>
          <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">
            Here is your one-time verification code to log in to your FinTrack account:
          </p>
          <div style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #38bdf8; padding: 20px; background-color: #0f172a; text-align: center; border-radius: 8px; margin: 24px 0; border: 1px solid #1e40af;">
            ${otp}
          </div>
          <p style="font-size: 13px; color: #94a3b8; line-height: 1.5;">
            This code will expire in <strong>10 minutes</strong>. If you did not request this verification code, please ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #334155; margin: 24px 0;" />
          <p style="font-size: 12px; color: #64748b; margin: 0; text-align: center;">
            FinTrack &copy; ${new Date().getFullYear()}
          </p>
        </div>
      </div>
    `,
    text: `Your FinTrack verification code is: ${otp}. It will expire in 10 minutes.`
  };

  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });

    const info = await transporter.sendMail(mailOptions);
    console.log(`\n✅ [OTP Email Sent] Successfully delivered to ${email}. Response: ${info.response}\n`);
    return { success: true, info };
  } catch (error) {
    console.error(`\n❌ [OTP Email Failed] Could not deliver email to ${email}:`, error.message);
    console.log(`🔑 [Dev Fallback] Email: ${email} | OTP: ${otp}\n`);
    return { success: false, reason: error.message };
  }
}

exports.reqOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.isAdmin) {
      return res.status(400).json({ success: false, message: 'Admin users do not require OTP' });
    }

    const otp = generateOTP();
    otpCache[email] = {
      otp,
      createdAt: Date.now()
    };

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🔑 [OTP REQUESTED] User: ${email}`);
    console.log(`🔑 [OTP CODE]      ${otp}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const emailResult = await sendOTP(email, otp);

    if (emailResult.success) {
      // Sent to real email inbox: do NOT send OTP in response body
      return res.json({
        success: true,
        message: 'OTP has been sent to your email address.',
        emailSent: true
      });
    } else {
      // Email failed or not configured: provide dev OTP so user is not stuck
      return res.json({
        success: true,
        message: 'Email delivery unavailable (configure EMAIL_USER & EMAIL_PASS in backend/.env).',
        emailSent: false,
        otp
      });
    }
  } catch (error) {
    console.error('reqOTP server error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.verifyOTP = (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP are required' });
  }

  const cachedData = otpCache[email];

  if (!cachedData) {
    return res.status(400).json({ success: false, message: 'OTP not found or expired. Please request a new OTP.' });
  }

  const now = Date.now();
  if (now - cachedData.createdAt > OTP_EXPIRY_MS) {
    delete otpCache[email];
    return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
  }

  if (cachedData.otp === String(otp).trim()) {
    delete otpCache[email];
    return res.json({ success: true, message: 'OTP verified' });
  } else {
    return res.status(400).json({ success: false, message: 'Invalid OTP. Please check your email and try again.' });
  }
};
