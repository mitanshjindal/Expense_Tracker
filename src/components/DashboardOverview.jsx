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

    const monthKey = `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Income" 
          value={totalIncome} 
          icon={<ArrowUpRight className="w-6 h-6 text-emerald-400" />}
          color="emerald"
          symbol={currencySymbol} 
        />
        <StatCard 
          title="Total Expenses" 
          value={totalExpenses} 
          icon={<ArrowDownRight className="w-6 h-6 text-rose-400" />}
          color="rose"
          symbol={currencySymbol} 
        />
        <StatCard 
          title="Net Savings" 
          value={savings} 
          icon={<Wallet className="w-6 h-6 text-blue-400" />}
          color="blue"
          symbol={currencySymbol} 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Financial Distribution */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
              Financial Breakdown
            </h2>
            <span className="text-xs text-gray-400">All-time ratio</span>
          </div>

          {pieChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val) => [formatCurrency ? formatCurrency(val) : `$${Number(val).toFixed(2)}`, 'Amount']}
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[280px] text-gray-400 text-sm">
              No financial data recorded yet
            </div>
          )}
        </div>

        {/* Monthly Trend */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Monthly Cash Flow</h2>
            <span className="text-xs text-gray-400">Recent months</span>
          </div>

          {barChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(val) => [formatCurrency ? formatCurrency(val) : `$${Number(val).toFixed(2)}`]}
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
                />
                <Legend />
                <Bar dataKey="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Expenses" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[280px] text-gray-400 text-sm">
              Add transactions to see your monthly flow trends
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700/50">
        <h2 className="text-xl font-semibold mb-4 text-white">Recent Transactions</h2>
        {transactions.length === 0 ? (
          <p className="text-gray-400 text-sm py-4">No transactions recorded yet. Add an income or expense to get started.</p>
        ) : (
          <ul className="divide-y divide-gray-700">
            {transactions.slice(0, 5).map((transaction, idx) => (
              <li key={transaction._id || transaction.id || idx} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium text-white">{transaction.name}</p>
                  <p className="text-xs text-gray-400">{transaction.category} • {transaction.date ? new Date(transaction.date).toLocaleDateString() : 'Recent'}</p>
                </div>
                <p className={`font-semibold text-sm ${transaction.type === 'expense' ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {transaction.type === 'expense' ? '-' : '+'}
                  {formatCurrency ? formatCurrency(transaction.amount) : `$${parseFloat(transaction.amount || 0).toFixed(2)}`}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
};

const StatCard = ({ title, value, icon, color, symbol = '$' }) => {
  const isPositive = value >= 0;
  const absValue = Math.abs(value);

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className={`bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700/60 relative overflow-hidden`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-400">{title}</span>
        <div className="p-2 rounded-lg bg-gray-700/60">{icon}</div>
      </div>
      <p className={`text-3xl font-extrabold ${color === 'emerald' ? 'text-emerald-400' : color === 'rose' ? 'text-rose-400' : isPositive ? 'text-blue-400' : 'text-rose-400'}`}>
        {!isPositive && '-'}{symbol}
        <CountUp end={absValue} decimals={2} duration={1.5} separator="," />
      </p>
    </motion.div>
  );
};

export default DashboardOverview;
