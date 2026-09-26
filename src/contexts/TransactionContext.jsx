


import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TransactionContext = createContext();

export const useTransactions = () => useContext(TransactionContext);

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
  }, [transactions]);

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
        axios.get('http://localhost:5000/api/expenses', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/incomes', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const expenses = expensesResponse.data.map(expense => ({ ...expense, type: 'expense' }));
      const incomes = incomesResponse.data.map(income => ({ ...income, type: 'income' }));

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
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
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

      const response = await axios.post(
        `http://localhost:5000/api/${transaction.type}s`,
        transaction,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTransactions(prevTransactions => [response.data, ...prevTransactions]);
      toast.success(`${transaction.type} added successfully!`);
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

      await axios.delete(`http://localhost:5000/api/${type}s/${id}`, {
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

      const response = await axios.put(
        `http://localhost:5000/api/${updatedTransaction.type}s/${id}`,
        updatedTransaction,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTransactions(prevTransactions =>
        prevTransactions.map(t => t._id === id ? { ...response.data, type: updatedTransaction.type } : t)
      );
      toast.success("Transaction updated successfully!");
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error('Failed to update transaction');
    }
  };

  const searchTransactions = (query, type) => {
    return transactions.filter(t => 
      t.type === type && 
      (t.name.toLowerCase().includes(query.toLowerCase()) || 
       t.category.toLowerCase().includes(query.toLowerCase()))
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
      searchTransactions,
      filterTransactions,
      totalIncome,
      totalExpenses,
      fetchTransactions 
    }}>
      {children}
    </TransactionContext.Provider>
  );
};

