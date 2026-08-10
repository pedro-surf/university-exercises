import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_URL;
const apiToken = import.meta.env.VITE_API_TOKEN;

const axiosInstance = axios.create({
  baseURL: baseURL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  if (apiToken) {
    config.headers.Authorization = `Bearer ${apiToken}`;
  }
  return config;
});

export default axiosInstance;
