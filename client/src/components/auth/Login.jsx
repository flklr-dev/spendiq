import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'react-hot-toast';
import { 
  EnvelopeIcon, 
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon 
} from '@heroicons/react/24/outline';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    const result = await login(formData);
    
    if (result.success) {
      toast.success('Welcome back!');
      navigate('/');
    } else {
      toast.error(result.error || 'Login failed');
      setErrors(prev => ({
        ...prev,
        submit: result.error
      }));
    }
    setLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 
                        bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Or{' '}
            <Link to="/register" className="font-medium text-purple-400 hover:text-purple-300">
              create a new account
            </Link>
          </p>
        </div>

        <div className="mt-8">
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl 
                        shadow-[0_0_15px_rgba(168,85,247,0.1)] border border-purple-500/20 p-8">
            <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
              <style>
                {`
                  input:-webkit-autofill,
                  input:-webkit-autofill:hover,
                  input:-webkit-autofill:focus,
                  input:-webkit-autofill:active {
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: #ffffff;
                  transition: background-color 5000s ease-in-out 0s;
                  box-shadow: inset 0 0 20px 20px rgb(30 41 59 / 0.5);
                }
              `}</style>

              {errors.submit && (
                <div className="bg-red-500/10 border border-red-500 text-red-400 
                              px-4 py-3 rounded-xl">
                  {errors.submit}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                    Email address
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="off"
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-purple-500/20 
                               rounded-xl bg-slate-800/50 text-white placeholder-slate-400
                               focus:outline-none focus:ring-2 focus:ring-purple-500/40 
                               focus:border-purple-500/40"
                      placeholder="you@example.com"
                    />
                    {errors.email && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="off"
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-12 py-2 border border-purple-500/20 
                               rounded-xl bg-slate-800/50 text-white placeholder-slate-400
                               focus:outline-none focus:ring-2 focus:ring-purple-500/40 
                               focus:border-purple-500/40"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 
                               hover:text-purple-400 transition-colors duration-200"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                    {errors.password && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 rounded-xl 
                           bg-purple-500 hover:bg-purple-600 text-white font-medium
                           focus:outline-none focus:ring-2 focus:ring-offset-2 
                           focus:ring-purple-500 disabled:opacity-50 
                           disabled:cursor-not-allowed transition-all duration-300"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-purple-500/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-800/50 text-slate-400">
                    or
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <a
                  href="http://localhost:5000/api/auth/google"
                  className="w-full flex items-center justify-center px-4 py-2 
                           border border-purple-500/20 rounded-xl bg-slate-800/50 
                           text-white hover:bg-purple-500/10 transition-all duration-300"
                >
                  <FcGoogle className="h-5 w-5 mr-2" />
                  Continue with Google
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 