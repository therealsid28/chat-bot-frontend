// /api/auth.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const signupUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await axios.post(`${API_URL}/api/v1/user/register`, data);
  return response.data;
};

export const loginUser = async (data: { email: string; password: string }) => {
  const response = await axios.post(`${API_URL}/api/v1/user/login`, data);
  return response.data;
};

// Local Storage
export const saveAuthToLocalStorage = (user: object, token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  }
};

export const getAuthFromLocalStorage = () => {
  if (typeof window === 'undefined') return null;

  const user = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  return {
    user: user ? JSON.parse(user) : null,
    token,
  };
};

export const clearAuthFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
};
