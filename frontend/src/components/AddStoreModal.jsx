import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from './Toast';
import { X } from 'lucide-react';

const AddStoreModal = ({ isOpen, onClose, onStoreAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: ''
  });
  const [loading, setLoading] = useState(false);
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    if (isOpen) {
      // Fetch STORE_OWNER users to populate the owner dropdown
      const fetchOwners = async () => {
        try {
          const response = await api.get('/admin/users?role=STORE_OWNER&limit=100');
          setOwners(response.data.data.users);
        } catch (error) {
          console.error('Failed to load store owners', error);
        }
      };
      fetchOwners();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.ownerId) {
      toast.error('Please select a Store Owner');
      return;
    }

    setLoading(true);
    try {
      await api.post('/admin/stores', {
        ...formData,
        ownerId: parseInt(formData.ownerId)
      });
      toast.success('Store created successfully!');
      setFormData({ name: '', email: '', address: '', ownerId: '' });
      onStoreAdded();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Failed to create store');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Add New Store</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 focus:outline-none">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Store Name</label>
            <input name="name" type="text" required minLength={20} maxLength={60}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              value={formData.name} onChange={handleChange} placeholder="Min 20 characters" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Store Email</label>
            <input name="email" type="email" required
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              value={formData.email} onChange={handleChange} placeholder="store@example.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Store Address</label>
            <input name="address" type="text" required maxLength={400}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              value={formData.address} onChange={handleChange} placeholder="Store Address" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Assign to Store Owner</label>
            <select name="ownerId" required
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              value={formData.ownerId} onChange={handleChange}>
              <option value="" disabled>Select an Owner</option>
              {owners.map(owner => (
                <option key={owner.id} value={owner.id}>{owner.name} ({owner.email})</option>
              ))}
            </select>
            {owners.length === 0 && (
              <p className="text-xs text-amber-600 mt-1">No store owners available. Create one first.</p>
            )}
          </div>
          
          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading || owners.length === 0}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
              {loading ? 'Creating...' : 'Create Store'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStoreModal;
