import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useTransactions } from '../contexts/TransactionContext';

const IncomeForm = () => {
  const { addTransaction } = useTransactions();
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: 'Salary',
    date: new Date().toISOString().split('T')[0],
    referral: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.amount) return;

    addTransaction({
      ...formData,
      type: 'income',
      amount: parseFloat(formData.amount),
    });
    setFormData({
      name: '',
      amount: '',
      category: 'Salary',
      date: new Date().toISOString().split('T')[0],
      referral: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800/90 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-700/60"
    >
      <h2 className="text-lg sm:text-xl font-bold mb-4 text-white flex items-center">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2.5" /> Add Income
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label htmlFor="income-name" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
              Income Source
            </label>
            <input
              type="text"
              id="income-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Salary, Client Gig"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-700 border border-gray-600 focus:border-emerald-500 focus:outline-none text-white text-sm"
            />
          </div>

          <div>
            <label htmlFor="income-amount" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
              Amount
            </label>
            <input
              type="number"
              id="income-amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              required
              min="0.01"
              step="0.01"
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-700 border border-gray-600 focus:border-emerald-500 focus:outline-none text-white text-sm"
            />
          </div>

          <div>
            <label htmlFor="income-category" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
              Category
            </label>
            <select
              id="income-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-700 border border-gray-600 focus:border-emerald-500 focus:outline-none text-white text-sm cursor-pointer"
            >
              {['Salary', 'Freelance', 'Investment', 'Gift', 'Other'].map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="income-date" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
              Date
            </label>
            <input
              type="date"
              id="income-date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-700 border border-gray-600 focus:border-emerald-500 focus:outline-none text-white text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="income-referral" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
            Referral / Note (Optional)
          </label>
          <input
            type="text"
            id="income-referral"
            name="referral"
            value={formData.referral}
            onChange={handleChange}
            placeholder="Invoice #, Client or Note"
            className="w-full px-3.5 py-2.5 rounded-xl bg-gray-700 border border-gray-600 focus:border-emerald-500 focus:outline-none text-white text-sm"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center"
        >
          <Plus className="w-4 h-4 mr-2" /> Record Income
        </motion.button>
      </form>
    </motion.div>
  );
};

export default IncomeForm;
