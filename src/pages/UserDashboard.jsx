import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import ExpenseForm from '../components/ExpenseForm';
import IncomeForm from '../components/IncomeForm';
import TransactionList from '../components/TransactionList';
import DashboardOverview from '../components/DashboardOverview';
import Settings from '../components/Settings';
import { useTransactions } from '../contexts/TransactionContext';
import PaymentModal from '../components/PaymentModal';
import api from '../config/api';

const UserDashboard = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const { transactions, totalIncome, totalExpenses } = useTransactions();
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [loading, setLoading] = useState(true);

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
      const response = await api.get('/payment/check-payment-status', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setHasPaid(response.data.hasPaid);
      if (!response.data.hasPaid) {
        setShowPaymentModal(true);
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setHasPaid(true);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white">
      <Sidebar setActiveView={setActiveView} activeView={activeView} />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-7xl mx-auto"
        >
          {loading ? (
            <div className="flex items-center justify-center py-20 text-gray-400">
              Loading FinTrack...
            </div>
          ) : hasPaid ? (
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
                  <TransactionList type="expense" />
                </div>
              )}
              {activeView === 'income' && (
                <div className="space-y-8">
                  <IncomeForm />
                  <TransactionList type="income" />
                </div>
              )}
              {activeView === 'profile' && (
                <Settings />
              )}
            </>
          ) : (
            <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 max-w-lg mx-auto text-center mt-12">
              <h2 className="text-2xl font-bold mb-3 text-white">Unlock Lifetime Access</h2>
              <p className="text-gray-300 text-sm mb-6">
                Complete the one-time activation to unlock full income/expense tracking, dynamic analytics, and unlimited cloud history.
              </p>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all"
              >
                Activate Now
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
