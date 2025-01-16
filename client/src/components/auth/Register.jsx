import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'react-hot-toast';
import { 
  UserIcon, 
  EnvelopeIcon, 
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon 
} from '@heroicons/react/24/outline';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirmPassword: false
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (!formData.confirmPassword || formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
    try {
      const result = await register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      });
      
      if (result.success) {
        toast.success('Account created successfully! Please sign in.');
        navigate('/login');
      } else {
        toast.error(result.error || 'Registration failed');
        if (result.error.includes('email')) {
          setErrors(prev => ({
            ...prev,
            email: result.error
          }));
        } else {
          setErrors(prev => ({
            ...prev,
            submit: result.error
          }));
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      setErrors(prev => ({
        ...prev,
        submit: 'An unexpected error occurred'
      }));
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 
                        bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Or{' '}
            <Link to="/login" className="font-medium text-purple-400 hover:text-purple-300">
              sign in to your account
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
                `}
              </style>
              
              {errors.submit && (
                <div className="bg-red-500/10 border border-red-500 text-red-400 
                              px-4 py-3 rounded-xl">
                  {errors.submit}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300">
                    Full name
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      autoComplete="new-name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        errors.name ? 'border-red-500' : 'border-purple-500/20'
                      } rounded-xl bg-slate-800/50 text-white placeholder-slate-400
                      focus:outline-none focus:ring-2 ${
                        errors.name ? 'focus:ring-red-500/40' : 'focus:ring-purple-500/40'
                      } focus:border-purple-500/40`}
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

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
                      autoComplete="new-email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        errors.email ? 'border-red-500' : 'border-purple-500/20'
                      } rounded-xl bg-slate-800/50 text-white placeholder-slate-400
                      focus:outline-none focus:ring-2 ${
                        errors.email ? 'focus:ring-red-500/40' : 'focus:ring-purple-500/40'
                      } focus:border-purple-500/40`}
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
                      type={showPasswords.password ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-12 py-2 border ${
                        errors.password ? 'border-red-500' : 'border-purple-500/20'
                      } rounded-xl bg-slate-800/50 text-white placeholder-slate-400
                      focus:outline-none focus:ring-2 ${
                        errors.password ? 'focus:ring-red-500/40' : 'focus:ring-purple-500/40'
                      } focus:border-purple-500/40`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('password')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 
                               hover:text-purple-400 transition-colors duration-200"
                    >
                      {showPasswords.password ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300">
                    Confirm password
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPasswords.confirmPassword ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-12 py-2 border ${
                        errors.confirmPassword ? 'border-red-500' : 'border-purple-500/20'
                      } rounded-xl bg-slate-800/50 text-white placeholder-slate-400
                      focus:outline-none focus:ring-2 ${
                        errors.confirmPassword ? 'focus:ring-red-500/40' : 'focus:ring-purple-500/40'
                      } focus:border-purple-500/40`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirmPassword')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 
                               hover:text-purple-400 transition-colors duration-200"
                    >
                      {showPasswords.confirmPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
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
                  {loading ? 'Creating account...' : 'Create account'}
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
                  Sign up with Google
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 