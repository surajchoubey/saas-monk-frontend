import axios from 'axios';

// Create an instance with the base URL of your NestJS backend
const api = axios.create({
  baseURL: 'http://localhost:5001/', // Replace with your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
