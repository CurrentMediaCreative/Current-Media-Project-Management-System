import axios from 'axios';

// Get base path for the application
const getBasePath = () => {
  if (import.meta.env.DEV) {
    return '';
  }
  return '/projects/management';
};

// Configure API base URL
const api = axios.create({
  baseURL: `${getBasePath()}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      // Redirect to login with correct base path
      window.location.href = `${getBasePath()}/login`;
    }
    return Promise.reject(error);
  }
);

// Export base path for use in other components
export const basePath = getBasePath();

export default api;
