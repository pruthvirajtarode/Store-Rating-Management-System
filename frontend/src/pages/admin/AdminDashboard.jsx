import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, Store, Star } from 'lucide-react';
import { toast } from '../../components/Toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        setStats(response.data.data);
      } catch (error) {
        toast.error('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-gray-500">Loading dashboard...</div>;
  if (!stats) return <div className="text-red-500">Failed to load data.</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Users" value={stats.totalUsers} icon={<Users size={24} className="text-blue-500" />} />
        <StatCard title="Total Stores" value={stats.totalStores} icon={<Store size={24} className="text-green-500" />} />
        <StatCard title="Total Ratings" value={stats.totalRatings} icon={<Star size={24} className="text-yellow-500" />} />
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm mt-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Users by Role</h2>
        <div className="space-y-4">
          {stats.usersByRole.map((roleStat) => (
            <div key={roleStat.role} className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">{roleStat.role}</span>
              <span className="bg-gray-100 text-gray-800 py-1 px-3 rounded-full text-sm font-semibold">
                {roleStat._count.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg border shadow-sm flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
    </div>
    <div className="p-3 bg-gray-50 rounded-full">
      {icon}
    </div>
  </div>
);

export default AdminDashboard;
