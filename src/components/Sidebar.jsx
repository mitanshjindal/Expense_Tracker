import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, DollarSign, CreditCard, User, LogOut, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ setActiveView, activeView }) => {
  const [username, setUsername] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedIsAdmin = localStorage.getItem('isAdmin') === 'true';
    if (storedUsername) setUsername(storedUsername);
    setIsAdmin(storedIsAdmin);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('email');
    navigate('/login');
  };

  const menuItems = [
    { icon: Home, label: 'Dashboard', view: 'dashboard' },
    { icon: DollarSign, label: 'Income', view: 'income' },
    { icon: CreditCard, label: 'Expenses', view: 'expenses' },
    { icon: User, label: 'Profile & Settings', view: 'profile' },
  ];

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="bg-gray-900 text-white w-64 min-h-screen p-5 flex flex-col border-r border-gray-800"
    >
      <div className="mb-8">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-base">
            FT
          </div>
          <h2 className="text-2xl font-black bg-gradient-to-r from-blue-400 via-indigo-300 to-white bg-clip-text text-transparent">
            FinTrack
          </h2>
        </div>
        {username && (
          <div className="mt-3 px-1 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-300 truncate">Hi, {username}</span>
            {isAdmin && (
              <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Admin
              </span>
            )}
          </div>
        )}
      </div>

      <nav className="flex-1">
        <ul className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = activeView === item.view;
            return (
              <li key={item.view}>
                <button
                  onClick={() => setActiveView(item.view)}
                  className={`flex items-center space-x-3 w-full px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/70'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}

          {isAdmin && (
            <li className="pt-3 border-t border-gray-800/80 mt-3">
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center space-x-3 w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 transition-all"
              >
                <Shield className="w-4 h-4 text-purple-400" />
                <span>Admin Panel</span>
              </button>
            </li>
          )}
        </ul>
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center space-x-3 w-full px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors mt-auto pt-4"
      >
        <LogOut className="w-4 h-4" />
        <span>Logout</span>
      </button>
    </motion.div>
  );
};

export default Sidebar;
