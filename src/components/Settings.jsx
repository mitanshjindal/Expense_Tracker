import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTransactions } from '../contexts/TransactionContext';
import { User, Shield, CheckCircle2, Download, Trash2, Globe, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { transactions, currency, changeCurrency, clearAllTransactions } = useTransactions();
  const [username, setUsername] = useState('User');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [confirmClear, setConfirmClear] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedEmail = localStorage.getItem('email');
    const storedIsAdmin = localStorage.getItem('isAdmin') === 'true';

    if (storedUsername) setUsername(storedUsername);
    if (storedEmail) setEmail(storedEmail);
    setIsAdmin(storedIsAdmin);
  }, []);

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(transactions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `fintrack_data_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
  };

  const handleClear = async () => {
    await clearAllTransactions();
    setConfirmClear(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 max-w-4xl"
    >
      {/* Profile Info Header */}
      <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
            {username.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-bold text-white">{username}</h2>
              {isAdmin && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center">
                  <Shield className="w-3 h-3 mr-1" /> Admin
                </span>
              )}
            </div>
            {email && <p className="text-gray-400 text-sm">{email}</p>}
            <div className="flex items-center text-xs text-emerald-400 mt-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Lifetime Access Active
            </div>
          </div>
        </div>

        {isAdmin && (
          <button
            onClick={() => navigate('/admin')}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-sm font-semibold shadow-md transition-all flex items-center"
          >
            <Shield className="w-4 h-4 mr-1.5" /> Open Admin Panel
          </button>
        )}
      </div>

      {/* Preferences Section */}
      <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700/60">
        <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
          <Globe className="w-5 h-5 mr-2 text-blue-400" /> Regional & Display Preferences
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-300 mb-1.5">
              Active Currency
            </label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => changeCurrency(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none text-white text-sm"
            >
              <option value="USD">USD ($) - US Dollar</option>
              <option value="INR">INR (₹) - Indian Rupee</option>
              <option value="EUR">EUR (€) - Euro</option>
              <option value="GBP">GBP (£) - British Pound</option>
              <option value="JPY">JPY (¥) - Japanese Yen</option>
            </select>
            <p className="text-xs text-gray-400 mt-1.5">Updates transaction figures and charts dynamically.</p>
          </div>

          <div>
            <label htmlFor="theme" className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center">
              <Palette className="w-4 h-4 mr-1 text-gray-400" /> Interface Appearance
            </label>
            <select
              id="theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none text-white text-sm"
            >
              <option value="dark">Dark Theme (Default)</option>
              <option value="system">Match System</option>
            </select>
            <p className="text-xs text-gray-400 mt-1.5">Optimized for high-contrast financial readability.</p>
          </div>
        </div>
      </div>

      {/* Data Management Section */}
      <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700/60">
        <h3 className="text-lg font-semibold mb-2 text-white">Data & Backup</h3>
        <p className="text-sm text-gray-400 mb-6">
          Safely export a snapshot of your transactions or manage account records.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={handleExportJSON}
            className="flex items-center justify-center px-4 py-3 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-xl text-white text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4 mr-2 text-blue-400" /> Export JSON Backup ({transactions.length} items)
          </button>

          {!confirmClear ? (
            <button
              onClick={() => setConfirmClear(true)}
              className="flex items-center justify-center px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Clear All Transactions
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleClear}
                className="flex-1 py-3 px-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                Confirm Delete All
              </button>
              <button
                onClick={() => setConfirmClear(false)}
                className="py-3 px-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
