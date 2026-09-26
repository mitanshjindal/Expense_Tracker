



import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, DollarSign, CreditCard, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ setActiveView, activeView }) => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const menuItems = [
    { icon: Home, label: 'Dashboard', view: 'dashboard' },
    { icon: DollarSign, label: 'Income', view: 'income' },
    { icon: CreditCard, label: 'Expenses', view: 'expenses' },
    { icon: User, label: 'Profile', view: 'profile' },
  ];

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="bg-gray-900 text-white w-64 min-h-screen p-4"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">FinTrack</h2>
        {username && <p className="mt-2 text-gray-400">Hi, {username}</p>}
      </div>
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.view}>
              <button
                onClick={() => setActiveView(item.view)}
                className={`flex items-center space-x-2 w-full p-2 rounded-lg transition-colors duration-200 ${
                  activeView === item.view ? 'bg-blue-600' : 'hover:bg-gray-800'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <button
        onClick={handleLogout}
        className="flex items-center space-x-2 w-full p-2 rounded-lg transition-colors duration-200 hover:bg-gray-800 mt-auto"
      >
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>
    </motion.div>
  );
};

export default Sidebar;

