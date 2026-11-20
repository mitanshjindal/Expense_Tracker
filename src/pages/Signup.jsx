import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import api from '../config/api';
import a1 from "../assets/images/a1.jpg"

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/signup', { username, email, password });
      localStorage.clear();
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.user.username);
      localStorage.setItem('email', response.data.user.email);
      localStorage.setItem('isAdmin', response.data.user.isAdmin);
      toast.success('Account created successfully!');
      navigate(response.data.user.isAdmin ? '/admin' : '/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
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
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Sign Up</h2>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300">Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-xl bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none text-white px-3.5 py-2.5 text-sm"
                />
              </div>
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
                  type="submit"
                  className="w-full py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Sign Up
                </motion.button>
              </div>
            </form>
            <p className="mt-4 text-sm text-gray-400">
              Already have an account? <Link to="/login" className="text-blue-500 hover:text-blue-400">Login</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Signup;




