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
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white">
            {type === 'expense' ? 'Expenses Record' : 'Income Record'}
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Showing {displayedTransactions.length} {displayedTransactions.length === 1 ? 'transaction' : 'transactions'}
          </p>
        </div>
        <button
          onClick={exportToCSV}
          disabled={displayedTransactions.length === 0}
          className="flex items-center px-3.5 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${type === 'expense' ? 'expenses' : 'incomes'} by name, category...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-700 text-white rounded-lg border border-transparent focus:border-blue-500 focus:outline-none text-sm placeholder-gray-400"
          />
        </div>
        <div className="relative">
          <Filter className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-9 pr-8 py-2 bg-gray-700 text-white rounded-lg border border-transparent focus:border-blue-500 focus:outline-none text-sm appearance-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {displayedTransactions.length === 0 ? (
        <div className="text-center py-10 bg-gray-900/40 rounded-lg border border-gray-700/50">
          <p className="text-gray-400 text-sm">
            {searchQuery || selectedCategory !== 'All' 
              ? 'No transactions match your current filters.' 
              : `No ${type === 'expense' ? 'expenses' : 'incomes'} recorded yet.`}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {displayedTransactions.map((transaction) => {
            const isEditing = editingTransaction && editingTransaction._id === transaction._id;
            const formattedAmount = formatCurrency 
              ? formatCurrency(transaction.amount) 
              : `$${parseFloat(transaction.amount || 0).toFixed(2)}`;

            return (
              <motion.li
                key={transaction._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border ${
                  type === 'expense' 
                    ? 'bg-red-500/10 border-red-500/20 hover:border-red-500/40' 
                    : 'bg-green-500/10 border-green-500/20 hover:border-green-500/40'
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
                        placeholder="Transaction name"
                        className="px-3 py-1.5 bg-gray-700 text-white rounded-md text-sm border border-gray-600 focus:border-blue-500 focus:outline-none"
                      />
                      <input
                        type="number"
                        name="amount"
                        value={editingTransaction.amount}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        placeholder="Amount"
                        className="px-3 py-1.5 bg-gray-700 text-white rounded-md text-sm border border-gray-600 focus:border-blue-500 focus:outline-none"
                      />
                      <select
                        name="category"
                        value={editingTransaction.category}
                        onChange={handleChange}
                        className="px-3 py-1.5 bg-gray-700 text-white rounded-md text-sm border border-gray-600 focus:border-blue-500 focus:outline-none"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex space-x-2 justify-end">
                      <button
                        type="submit"
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingTransaction(null)}
                        className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded-md text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex items-center mb-2 sm:mb-0">
                      <div className={`p-2.5 rounded-lg mr-3 ${
                        type === 'expense' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                      }`}>
                        {type === 'expense' ? (
                          <ShoppingCart className="w-5 h-5" />
                        ) : (
                          <DollarSign className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-base">{transaction.name}</p>
                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                          <span className="bg-gray-700 px-2 py-0.5 rounded text-gray-300 font-medium">{transaction.category}</span>
                          {transaction.referral && <span>• Ref: {transaction.referral}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto space-x-4">
                      <div className="text-left sm:text-right">
                        <p className={`font-bold text-base ${type === 'expense' ? 'text-red-400' : 'text-green-400'}`}>
                          {type === 'expense' ? '-' : '+'}{formattedAmount}
                        </p>
                        <p className="text-xs text-gray-400">
                          {transaction.date ? new Date(transaction.date).toLocaleDateString() : 'Recent'}
                        </p>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEdit(transaction)}
                          title="Edit transaction"
                          className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(transaction._id)}
                          title="Delete transaction"
                          className="p-1.5 rounded-lg hover:bg-red-900/40 text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </>
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
