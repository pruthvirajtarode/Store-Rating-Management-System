import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from '../../components/Toast';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-sm border max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create an Account</h1>
          <p className="text-sm text-gray-500 mt-2">Join RateHub today</p>
        </div>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input name="name" type="text" required minLength={20} maxLength={60}
              className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-primary/50"
              value={formData.name} onChange={handleChange} placeholder="Minimum 20 characters" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input name="email" type="email" required
              className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-primary/50"
              value={formData.email} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input name="address" type="text" required maxLength={400}
              className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-primary/50"
              value={formData.address} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input name="password" type="password" required
              className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-primary/50"
              value={formData.password} onChange={handleChange} placeholder="Min 8 chars, 1 uppercase, 1 special" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input name="confirmPassword" type="password" required
              className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-primary/50"
              value={formData.confirmPassword} onChange={handleChange} />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
            {loading ? 'Registering...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
