import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:5173/api',
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  console.log(token)
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
