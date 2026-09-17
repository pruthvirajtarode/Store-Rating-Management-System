import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, Users, Store as StoreIcon, Star } from 'lucide-react';

import ChangePasswordModal from '../components/ChangePasswordModal';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getLinks = () => {
    if (user.role === 'ADMIN') {
      return [
        { name: 'Dashboard', path: '/admin/dashboard', icon: <Home size={20} /> },
        { name: 'Stores', path: '/admin/stores', icon: <StoreIcon size={20} /> },
        { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
      ];
    }
    if (user.role === 'USER') {
      return [
        { name: 'Stores', path: '/user/stores', icon: <StoreIcon size={20} /> },
      ];
    }
    if (user.role === 'STORE_OWNER') {
      return [
        { name: 'Dashboard', path: '/owner/dashboard', icon: <Home size={20} /> },
      ];
    }
    return [];
  };

  const links = getLinks();

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r md:border-r flex flex-row md:flex-col justify-between md:justify-start shrink-0 overflow-x-auto">
        <div className="h-16 flex items-center px-6 border-b md:border-b shrink-0 gap-2">
          <img src="/images/logo.png" alt="RateHub Logo" className="h-8 w-8 object-contain" />
          <span className="font-bold text-xl text-primary tracking-tight">RateHub</span>
        </div>
        <nav className="flex flex-row md:flex-col md:flex-1 p-2 md:p-4 space-x-2 md:space-x-0 md:space-y-1 overflow-x-auto no-scrollbar">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-2 md:gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                location.pathname.startsWith(link.path)
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {link.icon}
              <span className="hidden sm:inline md:inline">{link.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-2 md:p-4 border-t shrink-0 flex flex-col gap-1 items-center">
          <button 
            onClick={() => setIsPasswordModalOpen(true)}
            className="flex md:w-full items-center gap-2 md:gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors whitespace-nowrap"
          >
            <span className="flex items-center justify-center w-5 h-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </span>
            <span className="hidden sm:inline md:inline">Change Password</span>
          </button>
          <button 
            onClick={handleLogout}
            className="flex md:w-full items-center gap-2 md:gap-3 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors whitespace-nowrap"
          >
            <LogOut size={20} />
            <span className="hidden sm:inline md:inline">Logout</span>
          </button>
        </div>
      </aside>

      <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-8 shrink-0">
          <h1 className="font-semibold text-lg text-gray-800 capitalize">
            {location.pathname.split('/').pop().replace('-', ' ')}
          </h1>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-sm font-semibold text-gray-800">{user.name}</span>
              <span className="text-xs font-medium text-gray-500">{user.role.replace('_', ' ')}</span>
            </div>
            <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm">
              <img src="/images/avatar.png" alt="Profile" className="h-full w-full object-cover" />
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
