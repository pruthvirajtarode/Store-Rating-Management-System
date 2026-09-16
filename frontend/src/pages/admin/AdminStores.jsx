import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from '../../components/Toast';

const AdminStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/stores?page=${page}&limit=10&search=${search}`);
      setStores(response.data.data.stores);
      setTotalPages(response.data.data.pagination.totalPages);
    } catch (error) {
      toast.error('Failed to load stores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchStores();
  };

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Search stores..."
            className="px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-primary/50 w-full md:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="px-4 py-2 bg-gray-100 border rounded-md hover:bg-gray-200">
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-gray-500 py-8 text-center">Loading stores...</div>
      ) : (
        <div className="overflow-x-auto">
          {stores.length === 0 ? (
            <div className="text-gray-500 text-center py-8">No stores found.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="p-3 font-medium text-gray-600">Store Name</th>
                  <th className="p-3 font-medium text-gray-600">Email</th>
                  <th className="p-3 font-medium text-gray-600">Address</th>
                  <th className="p-3 font-medium text-gray-600">Owner</th>
                  <th className="p-3 font-medium text-gray-600">Rating</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((store) => (
                  <tr key={store.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{store.name}</td>
                    <td className="p-3 text-gray-500">{store.email}</td>
                    <td className="p-3 text-gray-500 truncate max-w-xs">{store.address}</td>
                    <td className="p-3 text-gray-600">{store.owner?.name || 'N/A'}</td>
                    <td className="p-3">
                      <span className="font-semibold text-yellow-600">
                        {store.averageRating === 0 ? 'N/A' : `${store.averageRating} / 5`}
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
    </div>
  );
};

export default AdminStores;
