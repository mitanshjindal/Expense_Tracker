import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Shield, TrendingUp, DollarSign, LogOut, Search, Filter } from 'lucide-react';
import api from '../config/api';

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const PIE_COLORS = ['#EF4444', '#10B981', '#3B82F6', '#F59E0B'];

const Admin = () => {
  const [userStats, setUserStats] = useState([]);
  const [overallStats, setOverallStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [userStatsResponse, overallStatsResponse] = await Promise.all([
        api.get('/admin/user-stats', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        api.get('/admin/overall-stats', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);
      setUserStats(userStatsResponse.data || []);
      setOverallStats(overallStatsResponse.data || {});
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUserStats(prev => prev.filter(user => user._id !== userId));
      fetchData();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const filteredUsers = userStats.filter(user => {
    const q = searchQuery.toLowerCase();
    const matchesQuery = 
      (user.username && user.username.toLowerCase().includes(q)) ||
      (user.email && user.email.toLowerCase().includes(q));
    
    const balance = user.balance || 0;
    const matchesFilter = 
      filter === 'all' ||
      (filter === 'positive' && balance > 0) ||
      (filter === 'negative' && balance < 0);

    return matchesQuery && matchesFilter;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const monthlyStatsChart = (overallStats.monthlyStats || []).map(stat => ({
    name: MONTH_NAMES[stat.month - 1] || `M${stat.month}`,
    Income: stat.income || 0,
    Expenses: stat.expense || 0
  }));

  const userBalanceData = userStats.slice(0, 8).map(user => ({
    name: user.username,
    balance: user.balance || 0
  }));

  const totalExp = overallStats.totalExpenses || 0;
  const totalInc = overallStats.totalIncome || 0;
  const netBal = totalInc - totalExp;

  const expenseVsIncomeData = [
    { name: 'Expenses', value: totalExp },
    { name: 'Income', value: totalInc }
  ].filter(d => d.value > 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 md:p-10 bg-gray-950 min-h-screen text-white"
    >
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">System Administration</h1>
            <p className="text-xs text-gray-400">Global user metrics, transaction monitoring, and analytics</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-sm font-medium border border-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to App
          </button>
          <button
            onClick={() => {
              localStorage.clear();
              navigate('/login');
            }}
            className="flex items-center px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-sm font-medium border border-red-500/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24 text-gray-400 text-sm">
          Loading system metrics...
        </div>
      ) : (
        <>
          {/* Summary KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-900/80 p-5 rounded-2xl border border-gray-800 shadow-md">
              <div className="flex justify-between items-center text-gray-400 text-xs font-medium mb-2">
                <span>TOTAL REGISTERED USERS</span>
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-3xl font-extrabold text-blue-400">{overallStats.totalUsers || 0}</p>
            </div>

            <div className="bg-gray-900/80 p-5 rounded-2xl border border-gray-800 shadow-md">
              <div className="flex justify-between items-center text-gray-400 text-xs font-medium mb-2">
                <span>SYSTEM-WIDE INCOME</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-3xl font-extrabold text-emerald-400">${totalInc.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>

            <div className="bg-gray-900/80 p-5 rounded-2xl border border-gray-800 shadow-md">
              <div className="flex justify-between items-center text-gray-400 text-xs font-medium mb-2">
                <span>SYSTEM-WIDE EXPENSES</span>
                <DollarSign className="w-4 h-4 text-rose-400" />
              </div>
              <p className="text-3xl font-extrabold text-rose-400">${totalExp.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>

            <div className="bg-gray-900/80 p-5 rounded-2xl border border-gray-800 shadow-md">
              <div className="flex justify-between items-center text-gray-400 text-xs font-medium mb-2">
                <span>NET SYSTEM BALANCE</span>
                <Shield className="w-4 h-4 text-yellow-400" />
              </div>
              <p className={`text-3xl font-extrabold ${netBal >= 0 ? 'text-yellow-400' : 'text-rose-400'}`}>
                ${netBal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 shadow-md">
              <h2 className="text-lg font-semibold mb-4 text-white">Monthly Cash Flow Comparison</h2>
              {monthlyStatsChart.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={monthlyStatsChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', color: '#fff' }} />
                    <Legend />
                    <Bar dataKey="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Expenses" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[280px] text-gray-400 text-sm">
                  No monthly activity data yet
                </div>
              )}
            </div>

            <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 shadow-md">
              <h2 className="text-lg font-semibold mb-4 text-white">Active User Balance Ranking</h2>
              {userBalanceData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={userBalanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', color: '#fff' }} />
                    <Legend />
                    <Bar dataKey="balance" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[280px] text-gray-400 text-sm">
                  No user balances to display
                </div>
              )}
            </div>
          </div>

          {/* User Management Section */}
          <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-xl font-bold text-white">User Management</h2>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search username or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 text-sm focus:border-purple-500 focus:outline-none w-full sm:w-64"
                  />
                </div>
                <div className="relative">
                  <Filter className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="pl-9 pr-6 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 text-sm focus:border-purple-500 focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Users</option>
                    <option value="positive">Positive Balance</option>
                    <option value="negative">Negative Balance</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="text-xs uppercase bg-gray-800/60 text-gray-400 border-b border-gray-800">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Total Income</th>
                    <th className="py-3 px-4">Total Expenses</th>
                    <th className="py-3 px-4">Balance</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {currentUsers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-gray-400">
                        No users match the criteria.
                      </td>
                    </tr>
                  ) : (
                    currentUsers.map(user => {
                      const bal = user.balance || 0;
                      return (
                        <tr key={user._id} className="hover:bg-gray-800/30 transition-colors">
                          <td className="py-3 px-4 font-medium text-white">{user.username}</td>
                          <td className="py-3 px-4 text-gray-400">{user.email}</td>
                          <td className="py-3 px-4 text-emerald-400">${(user.totalIncome || 0).toFixed(2)}</td>
                          <td className="py-3 px-4 text-rose-400">${(user.totalExpenses || 0).toFixed(2)}</td>
                          <td className="py-3 px-4">
                            <span className={`font-semibold ${bal >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              ${bal.toFixed(2)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <button
                              onClick={() => setSelectedUser(user)}
                              className="px-3 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-semibold transition-colors"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => deleteUser(user._id)}
                              className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-semibold transition-colors"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {filteredUsers.length > usersPerPage && (
              <div className="mt-6 flex justify-center space-x-1">
                {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      currentPage === i + 1 ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Details Modal */}
          {selectedUser && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-2xl max-w-md w-full">
                <h3 className="text-xl font-bold mb-4 text-white">User Profile</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-1 border-b border-gray-800">
                    <span className="text-gray-400">Username:</span>
                    <span className="font-semibold text-white">{selectedUser.username}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-800">
                    <span className="text-gray-400">Email:</span>
                    <span className="text-white">{selectedUser.email}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-800">
                    <span className="text-gray-400">Registered:</span>
                    <span className="text-white">{selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-800">
                    <span className="text-gray-400">Total Income:</span>
                    <span className="text-emerald-400 font-semibold">${(selectedUser.totalIncome || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-800">
                    <span className="text-gray-400">Total Expenses:</span>
                    <span className="text-rose-400 font-semibold">${(selectedUser.totalExpenses || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-400">Current Balance:</span>
                    <span className={`font-bold ${(selectedUser.balance || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      ${(selectedUser.balance || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="mt-6 w-full py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-sm font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default Admin;
