import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import api from '../config/api';
import a1 from "../assets/images/a1.jpg";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Step 1: Verify email & password credentials
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        // Step 2: Send OTP to user's email
        const otpRes = await api.post('/auth/reqOTP', { email });
        setShowOtpInput(true);
        setOtp('');
        toast.success(otpRes.data?.message || 'Verification code sent to your email!');
      } else {
        toast.error(response.data.message || 'Login failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      const otpRes = await api.post('/auth/reqOTP', { email });
      setOtp('');
      toast.success(otpRes.data?.message || 'New OTP sent to your email!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Step 3: Verify the code from user's email
      const verifyResponse = await api.post('/auth/verifyOTP', { email, otp });
      if (verifyResponse.data.success) {
        localStorage.clear();
        localStorage.setItem('token', verifyResponse.data.token);
        localStorage.setItem('username', verifyResponse.data.user.username);
        localStorage.setItem('email', verifyResponse.data.user.email || email);
        localStorage.setItem('isAdmin', verifyResponse.data.user.isAdmin);
        toast.success('Logged in successfully!');
        navigate(verifyResponse.data.user.isAdmin ? '/admin' : '/');
      } else {
        toast.error(verifyResponse.data.message || 'Invalid OTP');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="flex w-full max-w-4xl bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="hidden md:block w-1/2 bg-cover bg-center" style={{backgroundImage: `url(${a1})`}}></div>
        <div className="w-full md:w-1/2 p-6 sm:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              {showOtpInput ? 'Two-Factor Verification' : 'Login'}
            </h2>

            {!showOtpInput ? (
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-xl bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none text-white px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-xl bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none text-white px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    type="submit"
                    className="w-full py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Verifying & Sending OTP...' : 'Login'}
                  </motion.button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <p className="text-xs sm:text-sm text-gray-300">
                  Enter the 6-digit code sent to your email: <span className="font-semibold text-blue-400 break-all">{email}</span>
                </p>

                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-300">Enter OTP</label>
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    autoFocus
                    className="mt-1 block w-full text-center tracking-widest text-lg font-mono rounded-xl bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none text-white px-3.5 py-2.5"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    type="submit"
                    className="w-full py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Verifying OTP...' : 'Verify OTP & Login'}
                  </motion.button>

                  <div className="flex items-center justify-between text-xs text-gray-400 pt-2">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isLoading}
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      Resend OTP
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowOtpInput(false)}
                      className="text-gray-400 hover:text-gray-200 underline"
                    >
                      Back to login
                    </button>
                  </div>
                </div>
              </form>
            )}

            <p className="mt-6 text-sm text-gray-400 text-center">
              Don't have an account? <Link to="/signup" className="text-blue-500 hover:text-blue-400 font-medium">Sign up</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
