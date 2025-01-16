import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

// Token expiration time (24 hours)
const TOKEN_EXPIRATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const tokenTimestamp = localStorage.getItem('tokenTimestamp');

    if (token && userData && tokenTimestamp) {
      // Check if token is expired
      const now = Date.now();
      const tokenAge = now - parseInt(tokenTimestamp);

      if (tokenAge > TOKEN_EXPIRATION) {
        // Token expired, logout user
        logout();
        toast.error('Session expired. Please login again.');
      } else {
        setUser(JSON.parse(userData));
      }
    }
    setLoading(false);
  };

  const login = async (credentials) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message);
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('tokenTimestamp', Date.now().toString());
      setUser(data.user);
      navigate('/');
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      return { success: true };

    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenTimestamp');
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 