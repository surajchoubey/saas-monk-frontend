import axios from 'axios';

const BASE_URL = "https://smss-monk-backend.onrender.com/";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
