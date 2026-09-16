import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from '../../components/Toast';

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

  if (loading) return <div className="text-gray-500 py-8 text-center">Loading dashboard...</div>;

  if (stores.length === 0) {
    return (
      <div className="bg-white p-12 text-center rounded-lg border shadow-sm">
        <h3 className="text-lg font-medium text-gray-900">No stores assigned</h3>
        <p className="mt-1 text-gray-500">You do not have any stores assigned to you yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {stores.map((store) => (
        <div key={store.id} className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="p-6 border-b bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{store.name}</h2>
              <p className="text-gray-500 mt-1">{store.address}</p>
            </div>
            <div className="flex gap-4">
              <div className="bg-white px-4 py-2 rounded-md border shadow-sm text-center">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Avg Rating</p>
                <p className="text-xl font-bold text-gray-900">{store.averageRating === 0 ? 'N/A' : `${store.averageRating} / 5`}</p>
              </div>
              <div className="bg-white px-4 py-2 rounded-md border shadow-sm text-center">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total</p>
                <p className="text-xl font-bold text-gray-900">{store.totalRatings}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Ratings</h3>
            {store.ratings.length === 0 ? (
              <p className="text-gray-500 italic">No users have submitted ratings yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="p-3 font-medium text-gray-600">User Name</th>
                      <th className="p-3 font-medium text-gray-600">Email</th>
                      <th className="p-3 font-medium text-gray-600">Rating</th>
                      <th className="p-3 font-medium text-gray-600">Submitted At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {store.ratings.map((rating) => (
                      <tr key={rating.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{rating.userName}</td>
                        <td className="p-3 text-gray-500">{rating.userEmail}</td>
                        <td className="p-3 font-semibold text-yellow-600">{rating.rating} / 5</td>
                        <td className="p-3 text-gray-500 text-sm">
                          {new Date(rating.submittedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OwnerDashboard;
