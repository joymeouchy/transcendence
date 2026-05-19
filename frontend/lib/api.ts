import axios from "axios";
import { authService } from "../services/auth.services";

export const api = axios.create({
  baseURL: "http://localhost:3001", // your backend URL
  // withCredentials: true, // IMPORTANT if you use cookies, commented out right now incase we add cookie authentication later
  // TODO: cookie authentication is more secure 
});

// attach token automatically
api.interceptors.request.use((config) => {
  const token = authService.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
