import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from '../../components/Toast';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const [authError, setAuthError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    if (!email || !password) {
      setAuthError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data.data;
      login(user, token);
      toast.success('Login successful!');
      
      if (user.role === 'ADMIN') navigate('/admin/dashboard');
      else if (user.role === 'STORE_OWNER') navigate('/owner/dashboard');
      else navigate('/user/stores');
    } catch (error) {
      if (error.response?.data?.message) {
        setAuthError(error.response.data.message);
      } else {
        setAuthError(error.message || 'Login failed due to network or server error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans relative overflow-hidden">
      {/* Subtle floating blobs for dynamic background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 animate-[pulse_8s_ease-in-out_infinite] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-100/40 rounded-full blur-3xl translate-y-1/3 animate-[pulse_10s_ease-in-out_infinite_alternate] pointer-events-none"></div>

      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden z-10 shadow-2xl">
        <img
          src="/signup-bg.png"
          alt="Professional Office"
          className="absolute inset-0 w-full h-full object-cover opacity-70 transform transition-transform duration-[20s] hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-blue-900/10"></div>
        <div className="relative z-10 flex flex-col justify-end p-16 text-white h-full pb-24">
          <h2 className="text-4xl font-bold mb-4 tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-8 duration-700">Welcome to RateHub</h2>
          <p className="text-lg text-gray-200 max-w-md font-light animate-in fade-in slide-in-from-bottom-10 duration-1000">
            Empowering your business decisions with comprehensive analytics and professional store rating management.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative z-10">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white animate-in zoom-in-95 duration-500">
          <div className="text-center lg:text-left mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Sign In</h1>
            <p className="text-gray-500 mt-2">Welcome back! Please enter your details.</p>
          </div>
          
          {authError && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <svg className="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm text-red-700 font-medium">{authError}</p>
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input type="email" required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-gray-900 shadow-sm"
                value={email} onChange={(e) => {setEmail(e.target.value); setAuthError('');}} placeholder="name@company.com" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all pr-12 text-gray-900 shadow-sm"
                  value={password} onChange={(e) => {setPassword(e.target.value); setAuthError('');}} placeholder="Enter your password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <button type="submit" disabled={loading}
              className="w-full bg-primary text-white py-3.5 rounded-xl font-medium hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4 flex justify-center items-center">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>
          
          <p className="text-center lg:text-left text-sm text-gray-600 mt-8">
            Don't have an account? <Link to="/signup" className="text-primary font-semibold hover:underline hover:text-blue-700 transition-colors">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
