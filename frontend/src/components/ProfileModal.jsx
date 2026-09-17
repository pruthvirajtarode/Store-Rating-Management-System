import React from 'react';
import { X, User as UserIcon, Mail, MapPin, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProfileModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header Cover */}
        <div className="h-32 bg-gradient-to-r from-primary to-indigo-600 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-1 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        {/* Avatar */}
        <div className="px-6 relative">
          <div className="absolute -top-12 h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-white">
            <img src="/images/avatar.png" alt="Profile" className="h-full w-full object-cover" />
          </div>
          
          {/* Action Button (Optional, visual only for this demo) */}
          <div className="flex justify-end pt-3 pb-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-primary border border-indigo-100">
              {user.role.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* User Info */}
        <div className="px-6 pb-8 pt-2">
          <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
          <p className="text-gray-500 text-sm mb-6 flex items-center gap-1.5 mt-1">
            <Mail size={16} />
            {user.email}
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="p-2 bg-white rounded-lg shadow-sm text-gray-400">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-0.5">Address</p>
                <p className="text-sm font-medium text-gray-900">{user.address}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="p-2 bg-white rounded-lg shadow-sm text-gray-400">
                <Shield size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-0.5">Account Type</p>
                <p className="text-sm font-medium text-gray-900 capitalize">{user.role.replace('_', ' ').toLowerCase()}</p>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default ProfileModal;
