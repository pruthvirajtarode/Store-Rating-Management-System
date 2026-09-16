import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from '../../components/Toast';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const OwnerDashboard = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/owner/dashboard');
        setStores(response.data.data);
      } catch (error) {
        toast.error('Failed to load owner dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="text-gray-500 py-8 text-center h-64 flex items-center justify-center">Loading dashboard...</div>;

  if (stores.length === 0) {
    return (
      <div className="bg-white p-12 text-center rounded-xl border border-gray-100 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900">No stores assigned</h3>
        <p className="mt-2 text-gray-500">You do not have any stores assigned to you yet.</p>
      </div>
    );
  }

  const getRatingDistribution = (ratings) => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    ratings.forEach(r => {
      if (dist[r.rating] !== undefined) dist[r.rating]++;
    });
    // Only return data that has counts > 0 to make the pie chart cleaner
    return [
      { name: '5 Stars', count: dist[5], color: '#22c55e' },
      { name: '4 Stars', count: dist[4], color: '#84cc16' },
      { name: '3 Stars', count: dist[3], color: '#eab308' },
      { name: '2 Stars', count: dist[2], color: '#f97316' },
      { name: '1 Star', count: dist[1], color: '#ef4444' },
    ].filter(item => item.count > 0);
  };

  return (
    <div className="space-y-8">
      {stores.map((store) => (
        <div key={store.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{store.name}</h2>
              <p className="text-gray-500 mt-1">{store.address}</p>
            </div>
            <div className="flex gap-4">
              <div className="bg-white px-6 py-3 rounded-xl border border-gray-100 shadow-sm text-center">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Avg Rating</p>
                <p className="text-2xl font-black text-gray-900">{store.averageRating === 0 ? 'N/A' : `${store.averageRating} / 5`}</p>
              </div>
              <div className="bg-white px-6 py-3 rounded-xl border border-gray-100 shadow-sm text-center">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Total</p>
                <p className="text-2xl font-black text-gray-900">{store.totalRatings}</p>
              </div>
            </div>
          </div>
          
          <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h3 className="text-lg font-bold text-gray-900 mb-6 tracking-tight">Recent Ratings</h3>
              {store.ratings.length === 0 ? (
                <p className="text-gray-500 italic p-4 bg-gray-50 rounded-lg">No users have submitted ratings yet.</p>
              ) : (
                <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="p-4 font-semibold text-gray-600 text-sm">User</th>
                        <th className="p-4 font-semibold text-gray-600 text-sm">Rating</th>
                        <th className="p-4 font-semibold text-gray-600 text-sm">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {store.ratings.map((rating) => (
                        <tr key={rating.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-4">
                            <p className="font-medium text-gray-900">{rating.userName}</p>
                            <p className="text-xs text-gray-500">{rating.userEmail}</p>
                          </td>
                          <td className="p-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-bold bg-yellow-50 text-yellow-700 border border-yellow-200">
                              ★ {rating.rating}
                            </span>
                          </td>
                          <td className="p-4 text-gray-500 text-sm font-medium">
                            {new Date(rating.submittedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <h3 className="text-lg font-bold text-gray-900 mb-6 tracking-tight">Rating Breakdown</h3>
              {store.ratings.length === 0 ? (
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-gray-400 italic">No data</p>
                </div>
              ) : (
                <div className="h-64 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getRatingDistribution(store.ratings)}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="count"
                      >
                        {getRatingDistribution(store.ratings).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                        itemStyle={{fontWeight: 'bold'}}
                      />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OwnerDashboard;
