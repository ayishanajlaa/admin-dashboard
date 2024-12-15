// src/services/authService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_USER_API_URL;

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const registerUser = async (name, email, password, isAdmin, interests) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { name, email, password, isAdmin, interests });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const getUserProfile = async () => {
  const token = getAuthToken();
  const response = await axios.get(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.user;
};

export const updateUserProfile = async (data) => {
  const token = getAuthToken();
  const response = await axios.put(`${API_URL}/update-profile`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
