import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from '../../components/Toast';
import { Plus, ArrowUp, ArrowDown } from 'lucide-react';
import AddUserModal from '../../components/AddUserModal';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Sorting state
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/users?page=${page}&limit=10&search=${search}&role=${roleFilter}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
      setUsers(response.data.data.users);
      setTotalPages(response.data.data.pagination.totalPages);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter, sortBy, sortOrder]); // re-fetch on these changes

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? <ArrowUp size={14} className="inline ml-1" /> : <ArrowDown size={14} className="inline ml-1" />;
  };

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Manage Users</h2>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} />
          Add User
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Search by name, email, address..."
            className="px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-primary/50 w-full md:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="px-4 py-2 bg-gray-100 border rounded-md hover:bg-gray-200">
            Search
          </button>
        </form>
        <select 
          className="px-3 py-2 border rounded-md outline-none w-full md:w-auto"
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Roles</option>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
          <option value="STORE_OWNER">Store Owner</option>
        </select>
      </div>

      {loading ? (
        <div className="text-gray-500 py-8 text-center">Loading users...</div>
      ) : (
        <div className="overflow-x-auto">
          {users.length === 0 ? (
            <div className="text-gray-500 text-center py-8">No users found.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="p-3 font-medium text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('name')}>
                    Name <SortIcon field="name" />
                  </th>
                  <th className="p-3 font-medium text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('email')}>
                    Email <SortIcon field="email" />
                  </th>
                  <th className="p-3 font-medium text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('address')}>
                    Address <SortIcon field="address" />
                  </th>
                  <th className="p-3 font-medium text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('role')}>
                    Role <SortIcon field="role" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{user.name}</td>
                    <td className="p-3 text-gray-500">{user.email}</td>
                    <td className="p-3 text-gray-500 truncate max-w-xs">{user.address}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-semibold">
                        {user.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 bg-gray-100 rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
          <button 
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 bg-gray-100 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
      
      <AddUserModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onUserAdded={() => { setPage(1); fetchUsers(); }} 
      />
    </div>
  );
};

export default AdminUsers;
