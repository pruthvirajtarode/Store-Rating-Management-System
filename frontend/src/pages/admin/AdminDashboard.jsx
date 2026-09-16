import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, Store, Star } from 'lucide-react';
import { toast } from '../../components/Toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, storesRes] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/stores?limit=10&sortBy=rating&sortOrder=desc') // Get top 10 rated stores
        ]);
        setStats(statsRes.data.data);
        setStores(storesRes.data.data.stores);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div className="text-gray-500 flex justify-center items-center h-64">Loading dashboard...</div>;
  if (!stats) return <div className="text-red-500">Failed to load data.</div>;

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Users" value={stats.totalUsers} icon={<Users size={28} className="text-blue-600" />} />
        <StatCard title="Total Stores" value={stats.totalStores} icon={<Store size={28} className="text-green-600" />} />
        <StatCard title="Total Ratings" value={stats.totalRatings} icon={<Star size={28} className="text-yellow-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Users by Role Breakdown */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm lg:col-span-1">
          <h2 className="text-lg font-bold text-gray-900 mb-6 tracking-tight">Users by Role</h2>
          <div className="space-y-5">
            {stats.usersByRole.map((roleStat) => (
              <div key={roleStat.role} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <span className="text-gray-700 font-medium capitalize">{roleStat.role.replace('_', ' ').toLowerCase()}</span>
                <span className="bg-primary text-white py-1 px-3 rounded-md text-sm font-bold shadow-sm">
                  {roleStat._count.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Stores Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-bold text-gray-900 mb-6 tracking-tight">Top Rated Stores Overview</h2>
          <div className="h-72 w-full">
            {stores.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stores} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} domain={[0, 5]} />
                  <Tooltip 
                    cursor={{fill: '#f3f4f6'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Legend iconType="circle" wrapperStyle={{paddingTop: '10px'}} />
                  <Bar dataKey="averageRating" name="Avg Rating (Out of 5)" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 italic">No store data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
    </div>
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
      {icon}
    </div>
  </div>
);

export default AdminDashboard;
