import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  console.log("TOKEN:", token);
  console.log("REQUEST:", config.url);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log("AUTH HEADER:", config.headers.Authorization);

  return config;
});

export default api;