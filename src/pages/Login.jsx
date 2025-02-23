import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import a1 from "../assets/images/a1.jpg"

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      if (response.data.success) {
        if (response.data.user.isAdmin) {
          
          const loginResponse = await axios.post('http://localhost:5000/api/auth/completeLogin', { email });
          localStorage.setItem('token', loginResponse.data.token);
          localStorage.setItem('username', loginResponse.data.user.username);
          localStorage.setItem('isAdmin', loginResponse.data.user.isAdmin);
          toast.success('Admin logged in successfully!');
          navigate('/admin');
        } else {
          
          await axios.post('http://localhost:5000/api/auth/reqOTP', { email });
          setShowOtpInput(true);
          toast.success('OTP sent to your email!');
        }
      } else {
        toast.error(response.data.message || 'Login failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const verifyResponse = await axios.post('http://localhost:5000/api/auth/verifyOTP', { email, otp });
      if (verifyResponse.data.message === 'OTP verified') {
        const loginResponse = await axios.post('http://localhost:5000/api/auth/completeLogin', { email });
        localStorage.setItem('token', loginResponse.data.token);
        localStorage.setItem('username', loginResponse.data.user.username);
        localStorage.setItem('isAdmin', loginResponse.data.user.isAdmin);
        toast.success('Logged in successfully!');
        navigate('/');
      } else {
        toast.error('Invalid OTP');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'OTP verification failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="flex w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="hidden md:block w-1/2 bg-cover bg-center" style={{backgroundImage: `url(${a1})`}}></div>
        <div className="w-full md:w-1/2 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">Login</h2>
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
                    className="mt-1 block w-full rounded-md bg-gray-700 border-transparent focus:border-blue-500 focus:bg-gray-600 focus:ring-0 text-white"
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
                    className="mt-1 block w-full rounded-md bg-gray-700 border-transparent focus:border-blue-500 focus:bg-gray-600 focus:ring-0 text-white"
                  />
                </div>
                <div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Login
                  </motion.button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-300">Enter OTP</label>
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md bg-gray-700 border-transparent focus:border-blue-500 focus:bg-gray-600 focus:ring-0 text-white"
                  />
                </div>
                <div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Verify OTP
                  </motion.button>
                </div>
              </form>
            )}
            <p className="mt-4 text-sm text-gray-400">
              Don't have an account? <Link to="/signup" className="text-blue-500 hover:text-blue-400">Sign up</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;



