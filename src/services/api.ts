import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  login: async (email: string, password: string) => {
    // Replace with your actual login endpoint
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (email: string, password: string, name: string) => {
    // Replace with your actual register endpoint
    const response = await api.post('/auth/register', { email, password, name });
    return response.data;
  },
};

export default api;
