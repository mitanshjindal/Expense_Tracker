


import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import ExpenseForm from '../components/ExpenseForm';
import IncomeForm from '../components/IncomeForm';
import TransactionList from '../components/TransactionList';
import DashboardOverview from '../components/DashboardOverview';
import { useTransactions } from '../contexts/TransactionContext';
import PaymentModal from '../components/PaymentModal';
import axios from 'axios';

const UserDashboard = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const { transactions } = useTransactions();
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      checkPaymentStatus();
    }
  }, [navigate]);

  const checkPaymentStatus = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/payment/check-payment-status', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setHasPaid(response.data.hasPaid);
      if (!response.data.hasPaid) {
        setShowPaymentModal(true);
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setHasPaid(true);
  };

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Sidebar setActiveView={setActiveView} activeView={activeView} />
      <main className="flex-1 p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          {hasPaid ? (
            <>
              {activeView === 'dashboard' && (
                <DashboardOverview 
                  totalIncome={totalIncome} 
                  totalExpenses={totalExpenses} 
                  transactions={transactions} 
                />
              )}
              {activeView === 'expenses' && (
                <div className="space-y-8">
                  <ExpenseForm />
                  <TransactionList transactions={transactions} type="expense" />
                </div>
              )}
              {activeView === 'income' && (
                <div className="space-y-8">
                  <IncomeForm />
                  <TransactionList transactions={transactions} type="income" />
                </div>
              )}
            </>
          ) : (
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Access Locked</h2>
              <p className="mb-4">Please make a one-time payment to access all features of the Finance Tracker.</p>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Make Payment
              </button>
            </div>
          )}
        </motion.div>
      </main>
      {showPaymentModal && (
        <PaymentModal
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default UserDashboard;

