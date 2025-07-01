import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} - Promise with user data
 */
export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    const { token, user } = response.data;

    // Store token in localStorage
    localStorage.setItem("token", token);

    return user;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Logout user
 */
export const logout = () => {
  localStorage.removeItem("token");
};

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>} - Promise with authentication status
 */
export const checkAuthStatus = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return false;
    }

    // Verify token with backend
    const response = await api.get("/auth/verify");
    return response.status === 200;
  } catch (error) {
    console.error("Auth check error:", error.response?.data || error.message);
    return false;
  }
};

export default api;
