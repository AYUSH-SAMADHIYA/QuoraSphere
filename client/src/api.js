import axios from 'axios';

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Replace later with your backend URL
});

API.interceptors.request.use((req) => {
  const user = localStorage.getItem("user");
  if (user) {
    req.headers.Authorization = `Bearer ${JSON.parse(user).token}`;
  }
  return req;
});

export default API;
