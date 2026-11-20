import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import CountUp from 'react-countup';
import { useTransactions } from '../contexts/TransactionContext';
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp } from 'lucide-react';

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const DashboardOverview = ({ totalIncome = 0, totalExpenses = 0, transactions = [] }) => {
  const { formatCurrency, currencySymbol } = useTransactions();
  const savings = totalIncome - totalExpenses;

  const hasData = totalIncome > 0 || totalExpenses > 0;

  const pieChartData = hasData ? [
    { name: 'Income', value: Math.max(0, totalIncome), color: '#10B981' },
    { name: 'Expenses', value: Math.max(0, totalExpenses), color: '#EF4444' },
    { name: 'Savings', value: Math.max(0, savings), color: '#3B82F6' },
  ].filter(item => item.value > 0) : [];

  const monthlyData = transactions.reduce((acc, transaction) => {
    if (!transaction.date) return acc;
    const date = new Date(transaction.date);
    if (isNaN(date.getTime())) return acc;

    const monthKey = `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear().toString().slice(-2)}`;
    const sortVal = date.getFullYear() * 100 + date.getMonth();
    
    if (!acc[monthKey]) {
      acc[monthKey] = { month: monthKey, Income: 0, Expenses: 0, sortVal };
    }
    
    const amount = parseFloat(transaction.amount || 0);
    if (transaction.type === 'income') {
      acc[monthKey].Income += amount;
    } else {
      acc[monthKey].Expenses += amount;
    }
    
    return acc;
  }, {});

  const barChartData = Object.values(monthlyData)
    .sort((a, b) => a.sortVal - b.sortVal)
    .slice(-6);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 sm:space-y-8"
    >
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <StatCard 
          title="Total Income" 
          value={totalIncome} 
          icon={<ArrowUpRight className="w-5 h-5 text-emerald-400" />}
          color="emerald"
          symbol={currencySymbol} 
        />
        <StatCard 
          title="Total Expenses" 
          value={totalExpenses} 
          icon={<ArrowDownRight className="w-5 h-5 text-rose-400" />}
          color="rose"
          symbol={currencySymbol} 
        />
        <StatCard 
          title="Net Savings" 
          value={savings} 
          icon={<Wallet className="w-5 h-5 text-blue-400" />}
          color="blue"
          symbol={currencySymbol} 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Financial Distribution */}
        <div className="bg-gray-800/90 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-700/60">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-blue-400" />
              Financial Breakdown
            </h2>
            <span className="text-xs text-gray-400">All-time</span>
          </div>

          {pieChartData.length > 0 ? (
            <div className="h-[240px] sm:h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val) => [formatCurrency ? formatCurrency(val) : `₹${Number(val).toFixed(2)}`, 'Amount']}
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[240px] text-gray-400 text-xs sm:text-sm">
              No financial data recorded yet
            </div>
          )}
        </div>

        {/* Monthly Trend */}
        <div className="bg-gray-800/90 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-700/60">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg font-bold text-white">Monthly Cash Flow</h2>
            <span className="text-xs text-gray-400">Recent</span>
          </div>

          {barChartData.length > 0 ? (
            <div className="h-[240px] sm:h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#9CA3AF" tick={{ fontSize: 10 }} />
                  <Tooltip 
                    formatter={(val) => [formatCurrency ? formatCurrency(val) : `₹${Number(val).toFixed(2)}`]}
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="Income" fill="#10B981" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Expenses" fill="#EF4444" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[240px] text-gray-400 text-xs sm:text-sm">
              Add transactions to see your monthly flow trends
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800/90 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-700/60">
        <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-white">Recent Transactions</h2>
        {transactions.length === 0 ? (
          <p className="text-gray-400 text-xs sm:text-sm py-4">No transactions recorded yet.</p>
        ) : (
          <ul className="divide-y divide-gray-700/60">
            {transactions.slice(0, 5).map((transaction, idx) => (
              <li key={transaction._id || transaction.id || idx} className="py-3 flex justify-between items-center gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-white text-sm sm:text-base truncate">{transaction.name}</p>
                  <p className="text-[11px] sm:text-xs text-gray-400 truncate">
                    {transaction.category} • {transaction.date ? new Date(transaction.date).toLocaleDateString() : 'Recent'}
                  </p>
                </div>
                <p className={`font-bold text-sm sm:text-base whitespace-nowrap ml-2 ${
                  transaction.type === 'expense' ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {transaction.type === 'expense' ? '-' : '+'}
                  {formatCurrency ? formatCurrency(transaction.amount) : `₹${parseFloat(transaction.amount || 0).toFixed(2)}`}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
};

const StatCard = ({ title, value, icon, color, symbol = '₹' }) => {
  const isPositive = value >= 0;
  const absValue = Math.abs(value);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-gray-800/90 rounded-2xl p-4 sm:p-5 shadow-lg border border-gray-700/60 relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs sm:text-sm font-medium text-gray-400">{title}</span>
        <div className="p-1.5 sm:p-2 rounded-lg bg-gray-700/60">{icon}</div>
      </div>
      <p className={`text-2xl sm:text-3xl font-black truncate ${
        color === 'emerald' ? 'text-emerald-400' : color === 'rose' ? 'text-rose-400' : isPositive ? 'text-blue-400' : 'text-rose-400'
      }`}>
        {!isPositive && '-'}{symbol}
        <CountUp end={absValue} decimals={2} duration={1.2} separator="," />
      </p>
    </motion.div>
  );
};

export default DashboardOverview;
