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

const UserDashboard = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const { transactions, totalIncome, totalExpenses, fetchTransactions } = useTransactions();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchTransactions();
    }
  }, [navigate]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white">
      {/* Navigation: Desktop Sidebar + Mobile Top Bar + Mobile Bottom Nav */}
      <Sidebar setActiveView={setActiveView} activeView={activeView} />

      {/* Main Content Area */}
      <main className="flex-1 w-full overflow-y-auto px-4 py-6 sm:px-6 md:p-8 pt-20 md:pt-8 pb-24 md:pb-8">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-7xl mx-auto"
        >
          {activeView === 'dashboard' && (
            <DashboardOverview 
              totalIncome={totalIncome} 
              totalExpenses={totalExpenses} 
              transactions={transactions} 
            />
          )}

          {activeView === 'expenses' && (
            <div className="space-y-6 sm:space-y-8">
              <ExpenseForm />
              <TransactionList type="expense" />
            </div>
          )}

          {activeView === 'income' && (
            <div className="space-y-6 sm:space-y-8">
              <IncomeForm />
              <TransactionList type="income" />
            </div>
          )}

          {activeView === 'profile' && (
            <Settings />
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default UserDashboard;
