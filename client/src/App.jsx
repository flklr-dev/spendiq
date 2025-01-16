import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from './components/layout/Header';
import Navbar from './components/layout/Navbar';
import AuthHeader from './components/auth/AuthHeader';
import Dashboard from './components/Dashboard';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AuthCallback from './components/auth/AuthCallback';
import Transactions from './components/transactions/Transactions';
import Budget from './components/Budget';
import SavingsGoals from './components/SavingsGoals';
import Reports from './components/Reports';
import AIInsights from './components/AIInsights';
import Settings from './components/Settings';
import { Toaster } from 'react-hot-toast';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e1b4b',
            color: '#fff',
            border: '1px solid rgba(139, 92, 246, 0.2)',
          },
          success: {
            icon: '🎉',
          },
          error: {
            icon: '❌',
          },
        }}
      />
      {isAuthenticated ? (
        <>
          <Header />
          <Navbar />
        </>
      ) : (
        <AuthHeader />
      )}
      <main className="w-full min-h-screen bg-slate-900 pt-16">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Protected Routes */}
          <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route
            path="/transactions"
            element={isAuthenticated ? <Transactions /> : <Navigate to="/login" />}
          />
          <Route
            path="/budget"
            element={isAuthenticated ? <Budget /> : <Navigate to="/login" />}
          />
          <Route
            path="/savings-goals"
            element={isAuthenticated ? <SavingsGoals /> : <Navigate to="/login" />}
          />
          <Route
            path="/reports"
            element={isAuthenticated ? <Reports /> : <Navigate to="/login" />}
          />
          <Route
            path="/insights"
            element={isAuthenticated ? <AIInsights /> : <Navigate to="/login" />}
          />
          <Route
            path="/settings"
            element={isAuthenticated ? <Settings /> : <Navigate to="/login" />}
          />
        </Routes>
      </main>
    </>
  );
}

export default App;
