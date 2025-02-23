require('dotenv').config();
const express = require('express');
const cors = require('cors');
const SSE = require('express-sse');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const adminRoutes = require('./routes/adminRoutes');
const otpRoutes = require('./routes/otpRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const app = express();


connectDB();

// Middleware
app.use(cors());
app.use(express.json());
const sse = new SSE();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/incomes', incomeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', otpRoutes);
app.use('/api/payment', paymentRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

