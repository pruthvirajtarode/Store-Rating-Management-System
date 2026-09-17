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
    <div className="min-h-screen flex bg-gray-50 font-sans">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden">
        <img
          src="/signup-bg.png"
          alt="Professional Office"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
        <div className="relative z-10 flex flex-col justify-end p-16 text-white h-full pb-24">
          <h2 className="text-4xl font-bold mb-4 tracking-tight leading-tight">Create an Account</h2>
          <p className="text-lg text-gray-200 max-w-md font-light">
            Join RateHub to access comprehensive analytics and manage your store ratings effectively with our professional tools.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 bg-white">
        <div className="w-full max-w-md">
          {success ? (
            <div className="text-center bg-green-50 p-10 rounded-2xl border border-green-100">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
              <p className="text-gray-600">Your account has been created. Redirecting you to the dashboard...</p>
            </div>
          ) : (
            <>
              <div className="text-center lg:text-left mb-10">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create Account</h1>
                <p className="text-gray-500 mt-2">Join RateHub today and get started</p>
              </div>
              
              <form onSubmit={handleSignup} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  <input name="name" type="text" required minLength={20} maxLength={60}
                    className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg outline-none focus:bg-white focus:ring-2 transition-all ${formData.name.length > 0 && formData.name.length < 20 ? 'border-red-400 focus:ring-red-400/20 focus:border-red-400' : 'border-gray-200 focus:ring-primary/20 focus:border-primary'}`}
                    value={formData.name} onChange={handleChange} placeholder="John Doe (20 chars min)" />
                  {formData.name.length > 0 && formData.name.length < 20 && (
                    <p className="text-xs text-red-500 mt-1.5 font-medium">
                      Minimum 20 characters required (currently {formData.name.length})
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input name="email" type="email" required
                    className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg outline-none focus:bg-white focus:ring-2 transition-all ${formData.email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? 'border-red-400 focus:ring-red-400/20 focus:border-red-400' : 'border-gray-200 focus:ring-primary/20 focus:border-primary'}`}
                    value={formData.email} onChange={handleChange} placeholder="name@company.com" />
                  {formData.email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                    <p className="text-xs text-red-500 mt-1.5 font-medium">
                      Please enter a valid email address
                    </p>
                  )}
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
                    <input name="password" type={showPassword ? "text" : "password"} required maxLength={16}
                      className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg outline-none focus:bg-white focus:ring-2 transition-all pr-12 ${formData.password.length > 0 && !/^(?=.*[A-Z])(?=.*[!@#$&*]).{8,16}$/.test(formData.password) ? 'border-red-400 focus:ring-red-400/20 focus:border-red-400' : 'border-gray-200 focus:ring-primary/20 focus:border-primary'}`}
                      value={formData.password} onChange={handleChange} placeholder="Min 8 chars, Max 16, 1 uppercase, 1 special" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {formData.password.length > 0 && !/^(?=.*[A-Z])(?=.*[!@#$&*]).{8,16}$/.test(formData.password) && (
                    <p className="text-xs text-red-500 mt-1.5 font-medium">
                      Password must be 8-16 characters, with 1 uppercase & 1 special char (!@#$&*)
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <input name="confirmPassword" type={showConfirmPassword ? "text" : "password"} required
                      className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg outline-none focus:bg-white focus:ring-2 transition-all pr-12 ${formData.confirmPassword.length > 0 && !passwordsMatch ? 'border-red-400 focus:ring-red-400/20 focus:border-red-400' : passwordsMatch ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20 ring-1 ring-green-500' : 'border-gray-200 focus:ring-primary/20 focus:border-primary'}`}
                      value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {formData.confirmPassword.length > 0 && !passwordsMatch && (
                    <p className="text-xs text-red-500 mt-1.5 font-medium">
                      Passwords do not match
                    </p>
                  )}
                </div>
                
                <button type="submit" disabled={loading}
                  className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed mt-4">
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
