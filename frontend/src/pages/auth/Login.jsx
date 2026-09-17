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

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
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
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message || 'Login failed due to network or server error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-950">
      {/* Left side - Dynamic Gamified Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden">
        <img
          src="/images/auth-bg.png"
          alt="Dynamic Gaming Neon Tech"
          className="absolute inset-0 w-full h-full object-cover scale-105 animate-[pulse_10s_ease-in-out_infinite] opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/40 via-transparent to-blue-900/30 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent"></div>
        
        <div className="relative z-10 flex flex-col justify-end p-12 text-white h-full pb-20">
          <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 backdrop-blur-md mb-6 w-max animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="text-sm font-semibold text-indigo-300 tracking-wide uppercase">RateHub Premium V2</span>
          </div>
          <h2 className="text-5xl font-extrabold mb-4 tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-indigo-300 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Level up your<br />store analytics.
          </h2>
          <p className="text-lg text-gray-300 max-w-md animate-in fade-in slide-in-from-bottom-8 duration-1200">
            Access real-time ratings, deep insights, and powerful management tools all in one dynamic dashboard.
          </p>
        </div>
      </div>

      {/* Right side - Glassmorphism Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative overflow-hidden">
        {/* Subtle background glow on the right side */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="w-full max-w-md relative z-10">
          <div className="text-center lg:text-left mb-10 animate-in fade-in zoom-in-95 duration-500">
            <h1 className="text-4xl font-bold text-white tracking-tight">Welcome Back</h1>
            <p className="text-gray-400 mt-3 text-lg">Initialize your session to continue</p>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <div className="relative group">
                  <input type="email" required
                    className="w-full px-4 py-3 bg-gray-950/50 border border-gray-700 rounded-xl outline-none text-white focus:bg-gray-900 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder-gray-600"
                    value={email} onChange={(e) => setEmail(e.target.value)} placeholder="player@ratehub.com" />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <div className="relative group">
                  <input type={showPassword ? "text" : "password"} required
                    className="w-full px-4 py-3 bg-gray-950/50 border border-gray-700 rounded-xl outline-none text-white focus:bg-gray-900 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all pr-12 placeholder-gray-600"
                    value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your passphrase" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-400 focus:outline-none transition-colors">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </div>
              </div>
              
              <button type="submit" disabled={loading}
                className="relative w-full py-3.5 rounded-xl font-bold text-white overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed mt-4 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-shadow">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 group-hover:from-indigo-500 group-hover:to-blue-500 transition-colors"></div>
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Authenticating...
                    </>
                  ) : 'Initialize Session'}
                </span>
              </button>
            </form>
          </div>
          
          <p className="text-center lg:text-left text-sm text-gray-500 mt-8 animate-in fade-in duration-1000 delay-300">
            New player? <Link to="/signup" className="text-indigo-400 font-semibold hover:text-indigo-300 hover:underline transition-colors">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
