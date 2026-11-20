const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  // If already connected, reuse connection (critical for Vercel serverless)
  if (isConnected || mongoose.connection.readyState === 1) {
    return;
  }

  try {
    const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/expensetrack';
    const db = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = db.connections[0].readyState === 1;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message || error);
  }
};

module.exports = connectDB;
