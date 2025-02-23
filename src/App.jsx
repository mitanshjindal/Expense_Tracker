import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import UserDashboard from './pages/UserDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Admin from './pages/Admin';
import "./App.css"
import { TransactionProvider } from './contexts/TransactionContext';

const PrivateRoute = ({ children, adminRequired = false }) => {
  const isAuthenticated = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (adminRequired && !isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <TransactionProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute adminRequired={true}><Admin /></PrivateRoute>} />
        </Routes>
      </TransactionProvider>
    </Router>
  );
}

export default App;

