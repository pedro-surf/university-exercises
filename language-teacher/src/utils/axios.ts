import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_URL;

const axiosInstance = axios.create({
  baseURL: baseURL || "http://localhost:3000", // Default to localhost if env variable is not set
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;