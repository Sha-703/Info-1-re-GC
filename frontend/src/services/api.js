import axios from 'axios';

const defaultApiBase = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:8000/api'
  : 'https://info1er-gc-backend-x1o4.onrender.com/api';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || defaultApiBase,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
