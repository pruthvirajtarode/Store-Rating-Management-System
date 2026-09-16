import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, Users, Store as StoreIcon, Star } from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="h-16 flex items-center px-6 border-b font-bold text-xl text-primary">
          RateHub
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname.startsWith(link.path)
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8">
          <h1 className="font-semibold text-lg text-gray-800 capitalize">
            {location.pathname.split('/').pop().replace('-', ' ')}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600">
              {user.name} <span className="ml-2 px-2 py-1 bg-gray-100 rounded-full text-xs">{user.role}</span>
            </span>
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
