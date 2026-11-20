import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTransactions } from '../contexts/TransactionContext';
import { Shield, CheckCircle2, Download, Trash2, Globe, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { transactions, clearAllTransactions } = useTransactions();
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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 sm:space-y-8 max-w-4xl"
    >
      {/* Profile Info Header */}
      <div className="bg-gray-800/90 rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5 sm:space-x-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-md flex-shrink-0">
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white truncate">{username}</h2>
              {isAdmin && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center">
                  <Shield className="w-3 h-3 mr-1" /> Admin
                </span>
              )}
            </div>
            {email && <p className="text-gray-400 text-xs sm:text-sm truncate mt-0.5">{email}</p>}
            <div className="flex items-center text-xs text-emerald-400 mt-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 flex-shrink-0" /> Full Access Active
            </div>
          </div>
        </div>

        {isAdmin && (
          <button
            onClick={() => navigate('/admin')}
            className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md transition-all flex items-center justify-center"
          >
            <Shield className="w-4 h-4 mr-1.5" /> Open Admin Panel
          </button>
        )}
      </div>

      {/* Preferences Section */}
      <div className="bg-gray-800/90 rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-700/60">
        <h3 className="text-base sm:text-lg font-bold mb-4 text-white flex items-center">
          <Globe className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-400" /> Preferences
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">
              Active Currency
            </label>
            <div className="w-full px-3.5 py-2.5 rounded-xl bg-gray-700/80 border border-gray-600 text-white text-xs sm:text-sm font-medium flex items-center justify-between">
              <span>Indian Rupee (₹ INR)</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-semibold">Standard</span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">All calculations, transactions and graphs are in INR (₹).</p>
          </div>

          <div>
            <label htmlFor="theme" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 flex items-center">
              <Palette className="w-3.5 h-3.5 mr-1 text-gray-400" /> Interface Theme
            </label>
            <select
              id="theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none text-white text-xs sm:text-sm cursor-pointer"
            >
              <option value="dark">Dark Theme (Default)</option>
              <option value="system">Match System</option>
            </select>
            <p className="text-[11px] text-gray-400 mt-1">Optimized for high financial readability.</p>
          </div>
        </div>
      </div>

      {/* Data Management Section */}
      <div className="bg-gray-800/90 rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-700/60">
        <h3 className="text-base sm:text-lg font-bold mb-1.5 text-white">Data & Backup</h3>
        <p className="text-xs sm:text-sm text-gray-400 mb-5">
          Safely export a snapshot of your records or manage your account data.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <button
            onClick={handleExportJSON}
            className="flex items-center justify-center px-4 py-3 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-xl text-white text-xs sm:text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4 mr-2 text-blue-400" /> Export JSON ({transactions.length} items)
          </button>

          {!confirmClear ? (
            <button
              onClick={() => setConfirmClear(true)}
              className="flex items-center justify-center px-4 py-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl text-rose-400 text-xs sm:text-sm font-medium transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Clear All Transactions
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleClear}
                className="flex-1 py-3 px-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors"
              >
                Confirm Delete All
              </button>
              <button
                onClick={() => setConfirmClear(false)}
                className="py-3 px-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-xs sm:text-sm transition-colors"
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
