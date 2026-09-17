import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Star, Store } from 'lucide-react';
import { toast } from '../../components/Toast';

const UserStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [ratingLoading, setRatingLoading] = useState(false);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/stores?page=${page}&limit=10&search=${search}`);
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

  const submitRating = async (storeId, newRating) => {
    setRatingLoading(true);
    try {
      const store = stores.find(s => s.id === storeId);
      
      if (store.userRating !== null && store.userRatingId) {
        await api.put(`/ratings/${store.userRatingId}`, { rating: newRating });
        toast.success('Rating updated successfully!');
      } else {
        await api.post('/ratings', { storeId, rating: newRating });
        toast.success('Rating submitted successfully!');
      }
      
      fetchStores(); // Refresh to get updated stats
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit rating');
    } finally {
      setRatingLoading(false);
    }
  };

  useEffect(() => {
    document.title = "RateHub | Browse Stores";
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Search by store name or address..."
            className="px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-primary/50 w-full md:w-80"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 font-medium transition-colors">
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-gray-500 text-center py-12 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-2"></div>
          Loading premium stores...
        </div>
      ) : stores.length === 0 ? (
        <div className="bg-white p-16 text-center rounded-2xl border shadow-sm flex flex-col items-center justify-center">
          <div className="bg-gray-50 p-4 rounded-full mb-4">
            <Store className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">No stores found</h3>
          <p className="mt-2 text-gray-500 max-w-sm">We couldn't find any stores matching your search. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stores.map((store) => (
            <div key={store.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
              {/* Premium Image Header */}
              <div className="h-56 w-full bg-gray-200 relative overflow-hidden">
                {store.imageUrl ? (
                  <img 
                    src={store.imageUrl} 
                    alt={store.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <Store className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                {/* Rating Badge Overlay */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 font-bold text-sm text-gray-900">
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  {store.averageRating > 0 ? Number(store.averageRating).toFixed(1) : 'New'}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{store.name}</h3>
                <p className="text-gray-500 text-sm mt-1 mb-6 flex-1 line-clamp-2">{store.address}</p>
                
                <div className="border-t pt-5 mt-auto">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-gray-700">
                      {store.userRating ? `Your Rating: ${store.userRating}` : 'Rate this store'}
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        disabled={ratingLoading}
                        onClick={() => submitRating(store.id, star)}
                        className="focus:outline-none transition-transform hover:scale-110 disabled:opacity-50"
                      >
                        <Star 
                          size={28} 
                          className={star <= (store.userRating || 0) ? "text-yellow-400 fill-yellow-400 drop-shadow-sm" : "text-gray-200 hover:text-yellow-300 transition-colors"} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-10 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg disabled:opacity-50 transition-colors"
          >
            Previous
          </button>
          <span className="text-sm font-medium text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">Page {page} of {totalPages}</span>
          <button 
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg disabled:opacity-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UserStores;
