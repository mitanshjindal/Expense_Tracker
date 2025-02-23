import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import CountUp from 'react-countup';

const DashboardOverview = ({ totalIncome, totalExpenses, transactions }) => {
  const savings = totalIncome - totalExpenses;

  const pieChartData = [
    { name: 'Income', value: totalIncome, color: '#4CAF50' },
    { name: 'Expenses', value: totalExpenses, color: '#F44336' },
    { name: 'Savings', value: savings, color: '#2196F3' },
  ];

  const monthlyData = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = { income: 0, expenses: 0 };
    }
    
    if (transaction.type === 'income') {
      acc[monthYear].income += transaction.amount;
    } else {
      acc[monthYear].expenses += transaction.amount;
    }
    
    return acc;
  }, {});

  const barChartData = Object.entries(monthlyData).map(([month, data]) => ({
    month,
    Income: data.income,
    Expenses: data.expenses,
  })).sort((a, b) => new Date(a.month) - new Date(b.month)).slice(-6);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Income" value={totalIncome} color="green" />
        <StatCard title="Total Expenses" value={totalExpenses} color="red" />
        <StatCard title="Savings" value={savings} color="blue" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-white">Financial Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-white">Monthly Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Income" fill="#4CAF50" />
              <Bar dataKey="Expenses" fill="#F44336" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-white">Recent Transactions</h2>
        <ul className="space-y-4">
          {transactions.slice(0, 5).map((transaction) => (
            <li key={transaction.id} className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-white">{transaction.name}</p>
                <p className="text-sm text-gray-300">{transaction.category}</p>
              </div>
              <p className={`font-bold ${transaction.type === 'expense' ? 'text-red-400' : 'text-green-400'}`}>
                {transaction.type === 'expense' ? '-' : '+'}${transaction.amount.toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

const StatCard = ({ title, value, color }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={`bg-gray-800 rounded-xl p-6 shadow-lg border-l-4 border-${color}-500`}
  >
    <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
    <p className={`text-3xl font-bold text-${color}-400`}>
      $<CountUp end={value} decimals={2} duration={2} />
    </p>
  </motion.div>
);

export default DashboardOverview;

