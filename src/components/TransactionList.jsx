import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingCart, Trash2, Edit, Download, Search, Filter } from 'lucide-react';
import { useTransactions } from '../contexts/TransactionContext';

const EXPENSE_CATEGORIES = ['Food', 'Transportation', 'Entertainment', 'Utilities', 'Shopping', 'Health', 'Other'];
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'];

const TransactionList = ({ type }) => {
  const { deleteTransaction, editTransaction, searchTransactions, filterTransactions, formatCurrency } = useTransactions();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [editingTransaction, setEditingTransaction] = useState(null);

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleDelete = (id) => {
    deleteTransaction(id, type);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction({
      ...transaction,
      amount: transaction.amount || ''
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!editingTransaction) return;

    editTransaction(editingTransaction._id, {
      ...editingTransaction,
      amount: parseFloat(editingTransaction.amount) || 0,
      type
    });
    setEditingTransaction(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingTransaction(prev => ({ ...prev, [name]: value }));
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Amount', 'Category', 'Date', 'Referral'];
    const csvData = displayedTransactions.map(t => [
      `"${(t.name || '').replace(/"/g, '""')}"`,
      parseFloat(t.amount || 0).toFixed(2),
      `"${(t.category || '').replace(/"/g, '""')}"`,
      t.date ? new Date(t.date).toLocaleDateString() : '',
      `"${(t.referral || '').replace(/"/g, '""')}"`
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${type}_transactions.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = filterTransactions(type, selectedCategory);
  const searched = searchTransactions(searchQuery, type);
  const displayedTransactions = searchQuery ? searched : filtered;

  return (
    <div className="bg-gray-800/90 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-700/60">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            {type === 'expense' ? 'Expenses Record' : 'Income Record'}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Showing {displayedTransactions.length} {displayedTransactions.length === 1 ? 'record' : 'records'}
          </p>
        </div>
        <button
          onClick={exportToCSV}
          disabled={displayedTransactions.length === 0}
          className="w-full sm:w-auto flex items-center justify-center px-3.5 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-medium rounded-xl transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </button>
      </div>

      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${type === 'expense' ? 'expenses' : 'incomes'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-700 text-white rounded-xl border border-gray-600 focus:border-blue-500 focus:outline-none text-xs sm:text-sm placeholder-gray-400"
          />
        </div>
        <div className="relative">
          <Filter className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto pl-9 pr-8 py-2 bg-gray-700 text-white rounded-xl border border-gray-600 focus:border-blue-500 focus:outline-none text-xs sm:text-sm appearance-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {displayedTransactions.length === 0 ? (
        <div className="text-center py-8 sm:py-10 bg-gray-900/40 rounded-xl border border-gray-700/50">
          <p className="text-gray-400 text-xs sm:text-sm">
            {searchQuery || selectedCategory !== 'All' 
              ? 'No transactions match your current search.' 
              : `No ${type === 'expense' ? 'expenses' : 'incomes'} recorded yet.`}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {displayedTransactions.map((transaction) => {
            const isEditing = editingTransaction && editingTransaction._id === transaction._id;
            const formattedAmount = formatCurrency 
              ? formatCurrency(transaction.amount) 
              : `₹${parseFloat(transaction.amount || 0).toFixed(2)}`;

            return (
              <motion.li
                key={transaction._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`p-3.5 sm:p-4 rounded-xl border ${
                  type === 'expense' 
                    ? 'bg-rose-500/10 border-rose-500/20 hover:border-rose-500/40' 
                    : 'bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/40'
                } transition-all`}
              >
                {isEditing ? (
                  <form onSubmit={handleUpdate} className="w-full space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        name="name"
                        value={editingTransaction.name}
                        onChange={handleChange}
                        required
                        placeholder="Description"
                        className="px-3 py-2 bg-gray-700 text-white rounded-lg text-xs sm:text-sm border border-gray-600 focus:border-blue-500 focus:outline-none"
                      />
                      <input
                        type="number"
                        name="amount"
                        value={editingTransaction.amount}
                        onChange={handleChange}
                        required
                        min="0.01"
                        step="0.01"
                        placeholder="Amount"
                        className="px-3 py-2 bg-gray-700 text-white rounded-lg text-xs sm:text-sm border border-gray-600 focus:border-blue-500 focus:outline-none"
                      />
                      <select
                        name="category"
                        value={editingTransaction.category}
                        onChange={handleChange}
                        className="px-3 py-2 bg-gray-700 text-white rounded-lg text-xs sm:text-sm border border-gray-600 focus:border-blue-500 focus:outline-none"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex space-x-2 justify-end pt-1">
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingTransaction(null)}
                        className="px-3.5 py-1.5 bg-gray-600 hover:bg-gray-500 text-white rounded-lg text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Left: Icon & Description */}
                    <div className="flex items-center min-w-0">
                      <div className={`p-2.5 rounded-xl mr-3 flex-shrink-0 ${
                        type === 'expense' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {type === 'expense' ? (
                          <ShoppingCart className="w-5 h-5" />
                        ) : (
                          <DollarSign className="w-5 h-5" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-white text-sm sm:text-base truncate">{transaction.name}</p>
                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                          <span className="bg-gray-700 px-2 py-0.5 rounded text-gray-300 font-medium text-[11px]">
                            {transaction.category}
                          </span>
                          {transaction.referral && (
                            <span className="truncate max-w-[150px] text-[11px]">• {transaction.referral}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Amount & Actions */}
                    <div className="flex items-center justify-between sm:justify-end space-x-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-700/50">
                      <div className="text-left sm:text-right">
                        <p className={`font-bold text-sm sm:text-base ${
                          type === 'expense' ? 'text-rose-400' : 'text-emerald-400'
                        }`}>
                          {type === 'expense' ? '-' : '+'}{formattedAmount}
                        </p>
                        <p className="text-[11px] sm:text-xs text-gray-400">
                          {transaction.date ? new Date(transaction.date).toLocaleDateString() : 'Recent'}
                        </p>
                      </div>
                      <div className="flex space-x-1 flex-shrink-0">
                        <button
                          onClick={() => handleEdit(transaction)}
                          title="Edit transaction"
                          className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(transaction._id)}
                          title="Delete transaction"
                          className="p-2 rounded-lg hover:bg-rose-900/40 text-gray-400 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default TransactionList;
