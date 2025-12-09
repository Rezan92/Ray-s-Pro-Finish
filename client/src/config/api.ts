// This determines the URL based on whether you are running locally or in production
const IS_DEVELOPMENT = import.meta.env.MODE === 'development';

export const API_BASE_URL = IS_DEVELOPMENT
  ? 'http://localhost:5000/api'
  : '/api'; // In production, we usually proxy or use a relative path

// A helper to make fetching cleaner
export const endpoints = {
  estimate: `${API_BASE_URL}/estimate`,
  contact: `${API_BASE_URL}/contact`,
  projects: `${API_BASE_URL}/projects`,
};