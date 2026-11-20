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
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        const loginResponse = await api.post('/auth/completeLogin', { email });
        localStorage.setItem('token', loginResponse.data.token);
        localStorage.setItem('username', loginResponse.data.user.username);
        localStorage.setItem('email', loginResponse.data.user.email || email);
        localStorage.setItem('isAdmin', loginResponse.data.user.isAdmin);
        toast.success(loginResponse.data.user.isAdmin ? 'Admin logged in successfully!' : 'Logged in successfully!');
        navigate(loginResponse.data.user.isAdmin ? '/admin' : '/');
      } else {
        toast.error(response.data.message || 'Login failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const requestOtp = async () => {
    if (!email) {
      toast.error('Please enter your email address first');
      return;
    }
    setIsLoading(true);
    try {
      const otpRes = await api.post('/auth/reqOTP', { email });
      setShowOtpInput(true);
      setOtp('');
      toast.success(otpRes.data?.message || 'OTP sent to your email inbox!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP to your email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const verifyResponse = await api.post('/auth/verifyOTP', { email, otp });
      if (verifyResponse.data.message === 'OTP verified' || verifyResponse.data.success) {
        const loginResponse = await api.post('/auth/completeLogin', { email });
        localStorage.setItem('token', loginResponse.data.token);
        localStorage.setItem('username', loginResponse.data.user.username);
        localStorage.setItem('email', loginResponse.data.user.email || email);
        localStorage.setItem('isAdmin', loginResponse.data.user.isAdmin);
        toast.success('Logged in successfully!');
        navigate(loginResponse.data.user.isAdmin ? '/admin' : '/');
      } else {
        toast.error('Invalid OTP');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="flex w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="hidden md:block w-1/2 bg-cover bg-center" style={{backgroundImage: `url(${a1})`}}></div>
        <div className="w-full md:w-1/2 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              {showOtpInput ? 'Two-Factor Verification' : 'Login'}
            </h2>

            {!showOtpInput ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md bg-gray-700 border-transparent focus:border-blue-500 focus:bg-gray-600 focus:ring-0 text-white px-3 py-2"
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
                    className="mt-1 block w-full rounded-md bg-gray-700 border-transparent focus:border-blue-500 focus:bg-gray-600 focus:ring-0 text-white px-3 py-2"
                  />
                </div>
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    type="submit"
                    className="w-full py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Verifying...' : 'Login'}
                  </motion.button>

                  <button
                    type="button"
                    onClick={requestOtp}
                    disabled={isLoading}
                    className="w-full text-center text-xs text-blue-400 hover:text-blue-300 underline block"
                  >
                    Or verify & log in via Email OTP
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <p className="text-sm text-gray-300">
                  Enter the 4-digit code sent to <span className="font-semibold text-blue-400">{email}</span>
                </p>

                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-300">Enter OTP</label>
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    maxLength={6}
                    placeholder="Enter 4-digit OTP"
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="mt-1 block w-full text-center tracking-widest text-lg font-mono rounded-md bg-gray-700 border-transparent focus:border-blue-500 focus:bg-gray-600 focus:ring-0 text-white px-3 py-2"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    type="submit"
                    className="w-full py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Verifying OTP...' : 'Verify OTP'}
                  </motion.button>

                  <div className="flex items-center justify-between text-xs text-gray-400 pt-2">
                    <button
                      type="button"
                      onClick={requestOtp}
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
