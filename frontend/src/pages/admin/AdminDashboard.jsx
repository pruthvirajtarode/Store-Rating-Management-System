import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, Store, Star, TrendingUp, Award } from 'lucide-react';
import { toast } from '../../components/Toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, storesRes] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/stores?limit=10&sortBy=rating&sortOrder=desc') 
        ]);
        
        // Format pie chart data
        const formattedStats = statsRes.data.data;
        formattedStats.pieData = formattedStats.usersByRole.map(r => ({
          name: r.role.replace('_', ' '),
          value: r._count.role
        }));

        setStats(formattedStats);
        setStores(storesRes.data.data.stores);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-[70vh] gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
      <p className="text-gray-500 font-medium animate-pulse">Loading Mission Control...</p>
    </div>
  );
  if (!stats) return <div className="text-red-500">Failed to load data.</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Gamification */}
      <div className="bg-gradient-to-r from-indigo-900 via-primary to-blue-800 rounded-2xl p-8 text-white shadow-xl shadow-primary/20 flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2 flex items-center gap-3">
            <Award className="text-yellow-400" size={32} />
            Command Center
          </h1>
          <p className="text-indigo-100 font-medium">Platform overview and performance metrics are looking fantastic.</p>
        </div>
        <div className="relative z-10 mt-6 md:mt-0 flex items-center bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl border border-white/20">
          <TrendingUp className="text-green-400 mr-3" size={24} />
          <div>
            <p className="text-xs text-indigo-200 uppercase tracking-wider font-bold">System Status</p>
            <p className="font-bold text-lg text-white">All Systems Nominal</p>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Explorers" 
          value={stats.totalUsers} 
          icon={<Users size={32} className="text-white" />} 
          bg="bg-gradient-to-br from-blue-500 to-indigo-600"
        />
        <StatCard 
          title="Active Outposts" 
          value={stats.totalStores} 
          icon={<Store size={32} className="text-white" />} 
          bg="bg-gradient-to-br from-emerald-400 to-green-600"
        />
        <StatCard 
          title="Total Ratings" 
          value={stats.totalRatings} 
          icon={<Star size={32} className="text-white fill-white/20" />} 
          bg="bg-gradient-to-br from-amber-400 to-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Users by Role Pie Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 lg:col-span-1 flex flex-col">
          <h2 className="text-xl font-extrabold text-gray-900 mb-2 tracking-tight">Role Distribution</h2>
          <p className="text-sm text-gray-500 mb-6">Breakdown of all active users on the platform.</p>
          <div className="flex-1 min-h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {stats.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none -mt-8">
              <span className="text-3xl font-black text-gray-800">{stats.totalUsers}</span>
            </div>
          </div>
        </div>

        {/* Top Stores Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 lg:col-span-2">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 mb-2 tracking-tight">Top Rated Outposts</h2>
              <p className="text-sm text-gray-500">The highest performing stores across the network.</p>
            </div>
            <div className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-100">Top 10</div>
          </div>
          
          <div className="h-72 w-full">
            {stores.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stores} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={1}/>
                      <stop offset="95%" stopColor="#818cf8" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12, fontWeight: 'bold'}} domain={[0, 5]} />
                  <Tooltip 
                    cursor={{fill: '#f3f4f6'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold'}}
                  />
                  <Bar dataKey="averageRating" name="Avg Rating" fill="url(#colorRating)" radius={[6, 6, 0, 0]} barSize={45} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <Store size={48} className="mb-4 opacity-20" />
                <p className="italic font-medium">No store data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, bg }) => (
  <div className={`relative overflow-hidden p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${bg}`}>
    <div className="absolute -right-6 -top-6 opacity-20 scale-150">
      {icon}
    </div>
    <div className="relative z-10 flex items-center justify-between">
      <div>
        <p className="text-white/80 font-semibold mb-1 uppercase tracking-wider text-xs">{title}</p>
        <p className="text-4xl font-black text-white tracking-tight">{value}</p>
      </div>
      <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl shadow-inner">
        {icon}
      </div>
    </div>
  </div>
);

export default AdminDashboard;
