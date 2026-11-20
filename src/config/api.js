import axios from 'axios';

// If VITE_API_URL is provided, use it (e.g. 'https://api.example.com').
// Otherwise, default to '/api' which works with Vercel rewrites and Vite proxy.
const rawBase = import.meta.env.VITE_API_URL || '';
const cleanBase = rawBase.replace(/\/+$/, '');
const baseURL = cleanBase ? `${cleanBase}/api` : '/api';

const api = axios.create({
  baseURL,
});

// Automatically attach Authorization token from localStorage if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
export { baseURL };
