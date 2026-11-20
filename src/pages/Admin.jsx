import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Shield, TrendingUp, DollarSign, LogOut, Search, Filter } from 'lucide-react';
import api from '../config/api';

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 sm:p-6 md:p-10 bg-gray-950 min-h-screen text-white"
    >
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 sm:p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white">System Administration</h1>
            <p className="text-xs text-gray-400">Global metrics & user directory</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto justify-end">
          <button
            onClick={() => navigate('/')}
            className="flex-1 sm:flex-initial flex items-center justify-center px-3.5 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs sm:text-sm font-medium border border-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to App
          </button>
          <button
            onClick={() => {
              localStorage.clear();
              navigate('/login');
            }}
            className="flex items-center justify-center px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl text-xs sm:text-sm font-medium border border-rose-500/30 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 text-gray-400 text-xs sm:text-sm">
          Loading system metrics...
        </div>
      ) : (
        <>
          {/* Summary KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-gray-900/80 p-4 sm:p-5 rounded-2xl border border-gray-800 shadow-md">
              <div className="flex justify-between items-center text-gray-400 text-[11px] sm:text-xs font-semibold mb-2 tracking-wide uppercase">
                <span>TOTAL USERS</span>
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-blue-400">{overallStats.totalUsers || 0}</p>
            </div>

            <div className="bg-gray-900/80 p-4 sm:p-5 rounded-2xl border border-gray-800 shadow-md">
              <div className="flex justify-between items-center text-gray-400 text-[11px] sm:text-xs font-semibold mb-2 tracking-wide uppercase">
                <span>SYSTEM INCOME</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-emerald-400 truncate">
                ₹{totalInc.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>

            <div className="bg-gray-900/80 p-4 sm:p-5 rounded-2xl border border-gray-800 shadow-md">
              <div className="flex justify-between items-center text-gray-400 text-[11px] sm:text-xs font-semibold mb-2 tracking-wide uppercase">
                <span>SYSTEM EXPENSES</span>
                <DollarSign className="w-4 h-4 text-rose-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-rose-400 truncate">
                ₹{totalExp.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>

            <div className="bg-gray-900/80 p-4 sm:p-5 rounded-2xl border border-gray-800 shadow-md">
              <div className="flex justify-between items-center text-gray-400 text-[11px] sm:text-xs font-semibold mb-2 tracking-wide uppercase">
                <span>NET BALANCE</span>
                <Shield className="w-4 h-4 text-yellow-400" />
              </div>
              <p className={`text-2xl sm:text-3xl font-black truncate ${netBal >= 0 ? 'text-yellow-400' : 'text-rose-400'}`}>
                ₹{netBal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div className="bg-gray-900/80 p-4 sm:p-6 rounded-2xl border border-gray-800 shadow-md">
              <h2 className="text-base sm:text-lg font-bold mb-4 text-white">Monthly Cash Flow Comparison</h2>
              {monthlyStatsChart.length > 0 ? (
                <div className="h-[240px] sm:h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyStatsChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fontSize: 10 }} />
                      <YAxis stroke="#9CA3AF" tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      <Bar dataKey="Income" fill="#10B981" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="Expenses" fill="#EF4444" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[240px] text-gray-400 text-xs sm:text-sm">
                  No monthly activity data yet
                </div>
              )}
            </div>

            <div className="bg-gray-900/80 p-4 sm:p-6 rounded-2xl border border-gray-800 shadow-md">
              <h2 className="text-base sm:text-lg font-bold mb-4 text-white">User Balance Ranking</h2>
              {userBalanceData.length > 0 ? (
                <div className="h-[240px] sm:h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={userBalanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fontSize: 10 }} />
                      <YAxis stroke="#9CA3AF" tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      <Bar dataKey="balance" fill="#8B5CF6" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[240px] text-gray-400 text-xs sm:text-sm">
                  No user balances to display
                </div>
              )}
            </div>
          </div>

          {/* User Management Section */}
          <div className="bg-gray-900/80 p-4 sm:p-6 rounded-2xl border border-gray-800 shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-white">User Directory</h2>
              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-3 py-2 bg-gray-800 text-white rounded-xl border border-gray-700 text-xs sm:text-sm focus:border-purple-500 focus:outline-none w-full sm:w-56"
                  />
                </div>
                <div className="relative">
                  <Filter className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full sm:w-auto pl-9 pr-7 py-2 bg-gray-800 text-white rounded-xl border border-gray-700 text-xs sm:text-sm focus:border-purple-500 focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Users</option>
                    <option value="positive">Positive Balance</option>
                    <option value="negative">Negative Balance</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <table className="w-full text-left text-xs sm:text-sm text-gray-300 min-w-[600px]">
                <thead className="text-[11px] uppercase bg-gray-800/60 text-gray-400 border-b border-gray-800">
                  <tr>
                    <th className="py-3 px-3 sm:px-4">User</th>
                    <th className="py-3 px-3 sm:px-4">Email</th>
                    <th className="py-3 px-3 sm:px-4">Income</th>
                    <th className="py-3 px-3 sm:px-4">Expenses</th>
                    <th className="py-3 px-3 sm:px-4">Balance</th>
                    <th className="py-3 px-3 sm:px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {currentUsers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-gray-400 text-xs sm:text-sm">
                        No users match the criteria.
                      </td>
                    </tr>
                  ) : (
                    currentUsers.map(user => {
                      const bal = user.balance || 0;
                      return (
                        <tr key={user._id} className="hover:bg-gray-800/30 transition-colors">
                          <td className="py-3 px-3 sm:px-4 font-semibold text-white">{user.username}</td>
                          <td className="py-3 px-3 sm:px-4 text-gray-400">{user.email}</td>
                          <td className="py-3 px-3 sm:px-4 text-emerald-400">₹{(user.totalIncome || 0).toFixed(2)}</td>
                          <td className="py-3 px-3 sm:px-4 text-rose-400">₹{(user.totalExpenses || 0).toFixed(2)}</td>
                          <td className="py-3 px-3 sm:px-4">
                            <span className={`font-semibold ${bal >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              ₹{bal.toFixed(2)}
                            </span>
                          </td>
                          <td className="py-3 px-3 sm:px-4 text-right space-x-1.5 sm:space-x-2 whitespace-nowrap">
                            <button
                              onClick={() => setSelectedUser(user)}
                              className="px-2.5 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-semibold transition-colors"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => deleteUser(user._id)}
                              className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-semibold transition-colors"
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
              <div className="mt-4 sm:mt-6 flex justify-center space-x-1">
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
              <div className="bg-gray-900 border border-gray-800 p-5 sm:p-6 rounded-2xl shadow-2xl max-w-md w-full">
                <h3 className="text-lg sm:text-xl font-bold mb-4 text-white">User Profile Details</h3>
                <div className="space-y-2.5 text-xs sm:text-sm">
                  <div className="flex justify-between py-1.5 border-b border-gray-800">
                    <span className="text-gray-400">Username:</span>
                    <span className="font-semibold text-white">{selectedUser.username}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-800">
                    <span className="text-gray-400">Email:</span>
                    <span className="text-white truncate max-w-[200px]">{selectedUser.email}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-800">
                    <span className="text-gray-400">Registered:</span>
                    <span className="text-white">{selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-800">
                    <span className="text-gray-400">Total Income:</span>
                    <span className="text-emerald-400 font-semibold">₹{(selectedUser.totalIncome || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-800">
                    <span className="text-gray-400">Total Expenses:</span>
                    <span className="text-rose-400 font-semibold">₹{(selectedUser.totalExpenses || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-gray-400">Current Balance:</span>
                    <span className={`font-bold ${(selectedUser.balance || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      ₹{(selectedUser.balance || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="mt-6 w-full py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors"
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
