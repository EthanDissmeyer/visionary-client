import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL, // Replace with your backend's base URL
});

export default axiosInstance;
