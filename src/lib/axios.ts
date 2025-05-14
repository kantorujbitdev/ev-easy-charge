// src/lib/axios.ts
import axios from "axios";
import { toast } from "sonner";
import { createBrowserHistory } from "history";

const API_URL = import.meta.env.VITE_API_URL;
const history = createBrowserHistory();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers!["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.error("Session expired, please login again");
      history.push("/login"); // redirect
      window.location.reload(); // force reload ke login
    }
    return Promise.reject(error);
  }
);

export default api;
