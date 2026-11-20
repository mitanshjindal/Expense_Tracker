require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const adminRoutes = require('./routes/adminRoutes');
const otpRoutes = require('./routes/otpRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

// Initialize DB connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Re-ensure DB connection for serverless cold-starts
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('DB connect middleware error:', err);
  }
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/incomes', incomeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', otpRoutes);
app.use('/api/payment', paymentRoutes);

const PORT = process.env.PORT || 5000;

// Only listen when executed directly, not when imported as a serverless function
if (process.env.VERCEL !== '1' && require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
