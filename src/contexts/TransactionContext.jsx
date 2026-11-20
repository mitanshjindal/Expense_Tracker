


import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../config/api';
import { useNavigate } from 'react-router-dom';

const TransactionContext = createContext();

export const useTransactions = () => useContext(TransactionContext);

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [currency] = useState('INR');
  const currencySymbol = '₹';
  const navigate = useNavigate();

  const formatCurrency = (val) => {
    const num = parseFloat(val || 0);
    return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [transactions]);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const [expensesResponse, incomesResponse] = await Promise.all([
        api.get('/expenses', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        api.get('/incomes', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const expenses = (expensesResponse.data || []).map(expense => ({ ...expense, type: 'expense' }));
      const incomes = (incomesResponse.data || []).map(income => ({ ...income, type: 'income' }));

      setTransactions([...expenses, ...incomes].sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (error) {
      console.error('Error fetching transactions:', error);
      if (error.response && error.response.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        toast.error('Failed to fetch transactions. Please try again.');
      }
    }
  };

  const calculateTotals = () => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    
    setTotalIncome(income);
    setTotalExpenses(expenses);
  };

  const addTransaction = async (transaction) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You must be logged in to add a transaction');
        return;
      }

      if (transaction.type === 'expense' && parseFloat(transaction.amount) > totalIncome - totalExpenses) {
        toast.error('Expense amount exceeds available balance');
        return;
      }

      const response = await api.post(
        `/${transaction.type}s`,
        transaction,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newTransaction = { ...response.data, type: transaction.type };
      setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
      toast.success(`${transaction.type === 'expense' ? 'Expense' : 'Income'} added successfully!`);
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error(error.response?.data?.message || `Failed to add ${transaction.type}`);
    }
  };

  const deleteTransaction = async (id, type) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You must be logged in to delete a transaction');
        return;
      }

      await api.delete(`/${type}s/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTransactions(prevTransactions => prevTransactions.filter(t => t._id !== id));
      toast.success("Transaction deleted successfully!");
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Failed to delete transaction');
    }
  };

  const editTransaction = async (id, updatedTransaction) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You must be logged in to edit a transaction');
        return;
      }

      if (updatedTransaction.type === 'expense' && parseFloat(updatedTransaction.amount) > totalIncome - totalExpenses) {
        toast.error('Updated expense amount exceeds available balance');
        return;
      }

      const response = await api.put(
        `/${updatedTransaction.type}s/${id}`,
        updatedTransaction,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updated = { ...response.data, type: updatedTransaction.type };
      setTransactions(prevTransactions =>
        prevTransactions.map(t => t._id === id ? updated : t)
      );
      toast.success("Transaction updated successfully!");
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error('Failed to update transaction');
    }
  };

  const clearAllTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const expenseDeletes = transactions
        .filter(t => t.type === 'expense')
        .map(t => api.delete(`/expenses/${t._id}`, { headers: { Authorization: `Bearer ${token}` } }));
      const incomeDeletes = transactions
        .filter(t => t.type === 'income')
        .map(t => api.delete(`/incomes/${t._id}`, { headers: { Authorization: `Bearer ${token}` } }));

      await Promise.all([...expenseDeletes, ...incomeDeletes]);
      setTransactions([]);
      toast.success('All transactions cleared successfully!');
    } catch (error) {
      console.error('Error clearing transactions:', error);
      toast.error('Failed to clear some transactions');
    }
  };

  const searchTransactions = (query, type) => {
    if (!query) return transactions.filter(t => t.type === type);
    const q = query.toLowerCase();
    return transactions.filter(t => 
      t.type === type && 
      ((t.name && t.name.toLowerCase().includes(q)) || 
       (t.category && t.category.toLowerCase().includes(q)) ||
       (t.referral && t.referral.toLowerCase().includes(q)))
    );
  };

  const filterTransactions = (type, category) => {
    return transactions.filter(t => 
      t.type === type && 
      (category === 'All' || t.category === category)
    );
  };

  return (
    <TransactionContext.Provider value={{ 
      transactions, 
      addTransaction, 
      deleteTransaction, 
      editTransaction,
      clearAllTransactions,
      searchTransactions,
      filterTransactions,
      totalIncome,
      totalExpenses,
      fetchTransactions,
      currency: 'INR',
      currencySymbol: '₹',
      formatCurrency
    }}>
      {children}
    </TransactionContext.Provider>
  );
};

