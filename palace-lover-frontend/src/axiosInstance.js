import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://localhost:7251',
  headers: {
    'Content-Type': 'application/json',
  }
});

export default axiosInstance;
