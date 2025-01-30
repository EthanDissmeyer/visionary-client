import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: `${process.env.REACT_APP_API_BASE_URL}/api`,  
    headers: {
        'Content-Type': 'application/json', // Ensures JSON requests
    },
});

export default axiosInstance;
