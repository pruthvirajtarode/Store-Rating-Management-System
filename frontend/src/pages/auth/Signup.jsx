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
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateForm = () => {
    const { name, email, address, password, confirmPassword } = formData;
    
    if (!name || !email || !address || !password || !confirmPassword) {
      toast.error('All fields are required.');
      return false;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return false;
    }

    // Min 8 chars, 1 uppercase, 1 special
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$&*]).{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error('Password must be at least 8 characters long, contain 1 uppercase letter and 1 special character.');
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
      toast.success('Registration successful!');
      navigate('/user/stores');
    } catch (error) {
      if (error.response?.data?.errors) {
        toast.error(error.response.data.errors[0].msg);
      } else {
        toast.error(error.response?.data?.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900">
        <img
          src="/signup-bg.png"
          alt="Professional Office"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
        <div className="relative z-10 flex flex-col justify-end p-12 text-white h-full">
          <h2 className="text-4xl font-bold mb-4">Empowering your business decisions</h2>
          <p className="text-lg text-gray-200 max-w-md">
            Join RateHub to access comprehensive analytics and manage your store ratings effectively with our professional tools.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          <div className="text-center lg:text-left mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create an Account</h1>
            <p className="text-gray-500 mt-2">Join RateHub today and get started</p>
          </div>
          
          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input name="name" type="text" required maxLength={60}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={formData.name} onChange={handleChange} placeholder="John Doe" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input name="email" type="email" required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={formData.email} onChange={handleChange} placeholder="john@example.com" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
              <input name="address" type="text" required maxLength={400}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={formData.address} onChange={handleChange} placeholder="123 Business Avenue" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input name="password" type={showPassword ? "text" : "password"} required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pr-12"
                  value={formData.password} onChange={handleChange} placeholder="Min 8 chars, 1 uppercase, 1 special" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <input name="confirmPassword" type={showConfirmPassword ? "text" : "password"} required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pr-12"
                  value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <button type="submit" disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </span>
              ) : 'Sign Up'}
            </button>
          </form>
          
          <p className="text-center lg:text-left text-sm text-gray-600 mt-8">
            Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
