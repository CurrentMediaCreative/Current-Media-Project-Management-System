import axios from 'axios';

// Configure API base URL
const baseURL = import.meta.env.PROD 
  ? 'https://current-media-project-management-system.onrender.com/pms/api'  // Production API URL
  : '/pms/api';  // In development, we're already under /pms path

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000 // 10 second timeout
});

// Add request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  // Clear any existing Authorization header
  delete config.headers.Authorization;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network error or timeout
      console.error('Network error:', error.message);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    switch (error.response.status) {
      case 401:
        // Handle unauthorized access
        localStorage.removeItem('token');
        window.location.href = '/pms/login';
        break;
      case 404:
        console.warn('Resource not found:', error.response.data?.message || 'Not found');
        break;
      case 400:
        console.warn('Bad request:', error.response.data?.message || 'Invalid request');
        break;
      case 500:
        console.error('Server error:', error.response.data?.message || 'Internal server error');
        break;
      default:
        console.error('API error:', error.response.data?.message || 'Unknown error');
    }

    return Promise.reject(error);
  }
);

export default api;
