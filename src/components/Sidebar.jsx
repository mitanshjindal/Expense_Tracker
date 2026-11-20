import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, DollarSign, CreditCard, User, LogOut, Shield, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ setActiveView, activeView }) => {
  const [username, setUsername] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
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

  const handleSelectView = (view) => {
    setActiveView(view);
    setMobileDrawerOpen(false);
  };

  const menuItems = [
    { icon: Home, label: 'Dashboard', view: 'dashboard' },
    { icon: DollarSign, label: 'Income', view: 'income' },
    { icon: CreditCard, label: 'Expenses', view: 'expenses' },
    { icon: User, label: 'Profile', view: 'profile' },
  ];

  return (
    <>
      {/* ================= MOBILE TOP HEADER BAR ================= */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 z-40 px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-md">
            FT
          </div>
          <span className="text-xl font-black bg-gradient-to-r from-blue-400 via-indigo-300 to-white bg-clip-text text-transparent">
            FinTrack
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {isAdmin && (
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Admin
            </span>
          )}
          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:text-white border border-gray-700/60 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* ================= MOBILE SLIDE-OUT DRAWER ================= */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileDrawerOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Drawer Content */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-4/5 max-w-xs bg-gray-900 border-r border-gray-800 p-6 flex flex-col h-full shadow-2xl z-10"
            >
              <div className="flex items-center justify-between pb-6 border-b border-gray-800 mb-6">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-sm">
                    FT
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">FinTrack</h3>
                    {username && <p className="text-xs text-gray-400">Hi, {username}</p>}
                  </div>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 space-y-1.5">
                {menuItems.map((item) => {
                  const isActive = activeView === item.view;
                  return (
                    <button
                      key={item.view}
                      onClick={() => handleSelectView(item.view)}
                      className={`flex items-center space-x-3 w-full px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                          : 'text-gray-300 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}

                {isAdmin && (
                  <button
                    onClick={() => {
                      setMobileDrawerOpen(false);
                      navigate('/admin');
                    }}
                    className="flex items-center space-x-3 w-full px-3.5 py-3 rounded-xl text-sm font-semibold text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 mt-3"
                  >
                    <Shield className="w-5 h-5 text-purple-400" />
                    <span>Admin Panel</span>
                  </button>
                )}
              </nav>

              <div className="pt-4 border-t border-gray-800 mt-auto">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-3.5 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MOBILE BOTTOM NAVIGATION BAR ================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800 z-40 flex items-center justify-around px-2">
        {menuItems.map((item) => {
          const isActive = activeView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => setActiveView(item.view)}
              className={`flex flex-col items-center justify-center flex-1 py-1.5 transition-colors ${
                isActive ? 'text-blue-400 font-semibold' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[11px] mt-1 tracking-tight">{item.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-0.5" />
              )}
            </button>
          );
        })}

        {isAdmin && (
          <button
            onClick={() => navigate('/admin')}
            className="flex flex-col items-center justify-center flex-1 py-1.5 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <Shield className="w-5 h-5 stroke-2" />
            <span className="text-[11px] mt-1 tracking-tight">Admin</span>
          </button>
        )}
      </nav>

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex flex-col w-64 min-h-screen bg-gray-900 text-white p-5 border-r border-gray-800 flex-shrink-0 sticky top-0 h-screen">
        <div className="mb-8">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-base shadow-md">
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
      </aside>
    </>
  );
};

export default Sidebar;
