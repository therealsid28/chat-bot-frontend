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
  // Only return _id, email, and token
  // console.log(response.data);
  const {_id, email} = response.data.user;
  const {token} = response.data;
  console.log({_id, email, token});
  return { _id, email, token };
};

export const fetchCurrentUser = async (token: string) => {
  const response = await axios.get(`${API_URL}/api/v1/user/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.user; // Adjust if your backend returns a different structure
};

// export const loginAndStoreUser = async (data: { email: string; password: string }) => {
//   const response = await axios.post(`${API_URL}/api/v1/user/login`, data);
//   const token = response.data.token;
//   // Fetch user details
//   const user = await fetchCurrentUser(token);
//   // Save only _id, email, password
//   const userToStore = {
//     _id: user._id,
//     email: user.email,
//     // password: data.password, // Storing password in localStorage is NOT recommended for security reasons
//   };
//   console.log(userToStore);
//   saveAuthToLocalStorage(userToStore, token);
//   return { user: userToStore, token };
// };

// Local Storage
export const saveAuthToLocalStorage = (user: { _id: string; email: string }, token: string) => {
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
