import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      
      if (token) {
        try {
          // Fetch user data with the token
          const response = await fetch('http://localhost:5000/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }

          const userData = await response.json();

          // Store token and user data
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);

          // Redirect to dashboard
          navigate('/');
        } catch (error) {
          console.error('Auth callback error:', error);
          navigate('/login?error=auth_failed');
        }
      } else {
        navigate('/login?error=no_token');
      }
    };

    handleCallback();
  }, [location, navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
        <p className="mt-4 text-white">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback; 