// axiosConfig.js
import axios from 'axios';

const baseURL = import.meta.env.VITE_BASE_URL;

// Create an instance of axios
const axiosInstance = axios.create({
  baseURL: baseURL, // Replace with your API's base URL
  timeout: 10000, // Set a timeout of 10 seconds
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// add a response interceptor that logs the response
axiosInstance.interceptors.response.use(
  response => {
    console.log('Response:', response);
    return response;
  },
  error => {
    console.error('Response error:', error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
