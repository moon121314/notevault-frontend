import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nv_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const hadAuthHeader = err.config?.headers?.Authorization;
    const isAuthRoute = err.config?.url?.includes('/auth/login') || err.config?.url?.includes('/auth/register');
    if (err.response?.status === 401 && hadAuthHeader && !isAuthRoute) {
      localStorage.removeItem('nv_token');
      localStorage.removeItem('nv_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;