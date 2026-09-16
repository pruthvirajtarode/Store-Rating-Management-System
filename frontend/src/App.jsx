import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Unauthorized from './pages/auth/Unauthorized';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminStores from './pages/admin/AdminStores';
// User Pages
import UserStores from './pages/user/UserStores';
// Owner Pages
import OwnerDashboard from './pages/owner/OwnerDashboard';

// Components
import { ToastContainer } from './components/Toast';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              
              {/* Admin Routes */}
              <Route element={<RoleProtectedRoute allowedRoles={['ADMIN']} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/stores" element={<AdminStores />} />
              </Route>

              {/* User Routes */}
              <Route element={<RoleProtectedRoute allowedRoles={['USER']} />}>
                <Route path="/user/stores" element={<UserStores />} />
              </Route>

              {/* Owner Routes */}
              <Route element={<RoleProtectedRoute allowedRoles={['STORE_OWNER']} />}>
                <Route path="/owner/dashboard" element={<OwnerDashboard />} />
              </Route>
              
            </Route>
          </Route>
          
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
      <ToastContainer />
    </AuthProvider>
  );
};

export default App;
