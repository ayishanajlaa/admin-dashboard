// src/services/apiService.js
import axios from 'axios';
import {getAuthToken} from './authService'



const API_URL = process.env.REACT_APP_USER_API_URL;
const BLOG_API_URL = process.env.REACT_APP_BLOG_API_URL;


export const getUserCount = async () => {
  const token = getAuthToken(); 

  try {
    const response = await axios.get(`${API_URL}/user-count`, {
      headers: { Authorization: `Bearer ${token}` }, 
    });
    return response.data.count;
  } catch (error) {
    console.error('Error fetching user count:', error);
    throw error;
  }
};


export const getBlogCount = async () => {
  const token = getAuthToken();

  try {
    const response = await axios.get(`${ BLOG_API_URL}/blog-count`, {
      headers: { Authorization: `Bearer ${token}` }, 
    });
    return response.data.count;
  } catch (error) {
    console.error('Error fetching user count:', error);
    throw error;
  }
}


