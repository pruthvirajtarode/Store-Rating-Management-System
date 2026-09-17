import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.message === 'Network Error') {
      const isDeployed = window.location.hostname.includes('vercel.app');
      const isLocalBackend = error.config?.baseURL?.includes('localhost');
      
      if (isDeployed && isLocalBackend) {
        return Promise.reject(new Error(
          "Setup Error: Your Vercel app is trying to connect to a local backend (localhost). " +
          "You must add VITE_API_URL to your Vercel Environment Variables pointing to your Render backend."
        ));
      }
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
