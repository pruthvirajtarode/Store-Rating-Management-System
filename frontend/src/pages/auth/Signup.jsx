import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from '../../components/Toast';
import { Eye, EyeOff } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateForm = () => {
    const { name, email, address, password, confirmPassword } = formData;
    
    if (!name || !email || !address || !password || !confirmPassword) {
      toast.error('All fields are required.');
      return false;
    }

    if (name.length < 20 || name.length > 60) {
      toast.error('Full name must be between 20 and 60 characters.');
      return false;
    }

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) {
      toast.error('Full name must contain only letters and spaces.');
      return false;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return false;
    }

    // Min 8 chars, Max 16 chars, 1 uppercase, 1 special
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$&*]).{8,16}$/;
    if (!passwordRegex.test(password)) {
      toast.error('Password must be 8-16 characters long, contain 1 uppercase letter and 1 special character.');
      return false;
    }

    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await api.post('/auth/signup', formData);
      const { user, token } = response.data.data;
      login(user, token);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/user/stores');
      }, 2500);

    } catch (error) {
      if (error.response?.data?.errors) {
        toast.error(error.response.data.errors[0].msg);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message || 'Registration failed due to network or server error');
      }
      setLoading(false);
    }
  };

  const passwordsMatch = formData.password.length > 0 && formData.password === formData.confirmPassword;

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
            Join the elite<br />store managers.
          </h2>
          <p className="text-lg text-gray-300 max-w-md animate-in fade-in slide-in-from-bottom-8 duration-1200">
            Create your account today and unlock a next-generation platform for powerful rating insights.
          </p>
        </div>
      </div>

      {/* Right side - Glassmorphism Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="w-full max-w-md relative z-10">
          {success ? (
            <div className="text-center bg-gray-900/80 backdrop-blur-xl p-10 rounded-2xl border border-indigo-500/30 shadow-[0_0_40px_rgba(79,70,229,0.2)] animate-in zoom-in-95 duration-500">
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-indigo-500/20 border border-indigo-500/50 mb-6 shadow-[0_0_20px_rgba(79,70,229,0.5)]">
                <svg className="h-10 w-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-extrabold text-white mb-2">Registration Complete!</h2>
              <p className="text-indigo-200">Account initialized. Teleporting to dashboard...</p>
            </div>
          ) : (
            <>
              <div className="text-center lg:text-left mb-8 animate-in fade-in zoom-in-95 duration-500">
                <h1 className="text-4xl font-bold text-white tracking-tight">Create Account</h1>
                <p className="text-gray-400 mt-3 text-lg">Join RateHub and get started</p>
              </div>
              
              <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                <form onSubmit={handleSignup} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
                    <input name="name" type="text" required minLength={20} maxLength={60}
                      className={`w-full px-4 py-3 bg-gray-950/50 border rounded-xl outline-none text-white focus:bg-gray-900 focus:ring-2 transition-all placeholder-gray-600 ${formData.name.length > 0 && formData.name.length < 20 ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' : 'border-gray-700 focus:ring-indigo-500/50 focus:border-indigo-500'}`}
                      value={formData.name} onChange={handleChange} placeholder="John Doe (20 chars min)" />
                    {formData.name.length > 0 && formData.name.length < 20 && (
                      <p className="text-xs text-red-400 mt-1.5 font-medium">
                        Minimum 20 characters required (currently {formData.name.length})
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                    <input name="email" type="email" required
                      className={`w-full px-4 py-3 bg-gray-950/50 border rounded-xl outline-none text-white focus:bg-gray-900 focus:ring-2 transition-all placeholder-gray-600 ${formData.email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' : 'border-gray-700 focus:ring-indigo-500/50 focus:border-indigo-500'}`}
                      value={formData.email} onChange={handleChange} placeholder="player@example.com" />
                    {formData.email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                      <p className="text-xs text-red-400 mt-1.5 font-medium">
                        Please enter a valid email address
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Address</label>
                    <input name="address" type="text" required maxLength={400}
                      className="w-full px-4 py-3 bg-gray-950/50 border border-gray-700 rounded-xl outline-none text-white focus:bg-gray-900 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder-gray-600"
                      value={formData.address} onChange={handleChange} placeholder="123 Cyber Avenue" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
                    <div className="relative">
                      <input name="password" type={showPassword ? "text" : "password"} required maxLength={16}
                        className={`w-full px-4 py-3 bg-gray-950/50 border rounded-xl outline-none text-white focus:bg-gray-900 focus:ring-2 transition-all pr-12 placeholder-gray-600 ${formData.password.length > 0 && !/^(?=.*[A-Z])(?=.*[!@#$&*]).{8,16}$/.test(formData.password) ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' : 'border-gray-700 focus:ring-indigo-500/50 focus:border-indigo-500'}`}
                        value={formData.password} onChange={handleChange} placeholder="Min 8 chars, Max 16, 1 uppercase, 1 special" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-400 focus:outline-none transition-colors">
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {formData.password.length > 0 && !/^(?=.*[A-Z])(?=.*[!@#$&*]).{8,16}$/.test(formData.password) && (
                      <p className="text-xs text-red-400 mt-1.5 font-medium">
                        Password must be 8-16 characters, with 1 uppercase & 1 special char (!@#$&*)
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Confirm Password</label>
                    <div className="relative">
                      <input name="confirmPassword" type={showConfirmPassword ? "text" : "password"} required
                        className={`w-full px-4 py-3 bg-gray-950/50 border rounded-xl outline-none text-white focus:bg-gray-900 focus:ring-2 transition-all pr-12 placeholder-gray-600 ${formData.confirmPassword.length > 0 && !passwordsMatch ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' : passwordsMatch ? 'border-emerald-500 focus:ring-emerald-500/50 focus:border-emerald-500 ring-1 ring-emerald-500' : 'border-gray-700 focus:ring-indigo-500/50 focus:border-indigo-500'}`}
                        value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-400 focus:outline-none transition-colors">
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {formData.confirmPassword.length > 0 && !passwordsMatch && (
                      <p className="text-xs text-red-400 mt-1.5 font-medium">
                        Passwords do not match
                      </p>
                    )}
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
                          Initializing...
                        </>
                      ) : 'Create Account'}
                    </span>
                  </button>
                </form>
              </div>
              
              <p className="text-center lg:text-left text-sm text-gray-500 mt-8 animate-in fade-in duration-1000 delay-300">
                Already have an account? <Link to="/login" className="text-indigo-400 font-semibold hover:text-indigo-300 hover:underline transition-colors">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
