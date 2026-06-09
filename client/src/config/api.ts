// This determines the URL based on whether you are running locally or in production
const IS_DEVELOPMENT = import.meta.env.MODE === 'development';

// 1. Check for an explicit override (good for future domain changes)
// 2. Otherwise, switch based on the build mode
export const API_BASE_URL = import.meta.env.VITE_API_URL || (IS_DEVELOPMENT
  ? 'http://localhost:5000/api'
  : 'https://ray-s-pro-finish-api.onrender.com/api');

// A helper to make fetching cleaner
export const endpoints = {
  estimate: `${API_BASE_URL}/estimate`,
  contact: `${API_BASE_URL}/contact`,
  projects: `${API_BASE_URL}/projects`,
};