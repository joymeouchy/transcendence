import axios from "axios";
import { tokenStorage } from "./token";
import { alertManager } from "./alert";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://transcendence-backend-production.up.railway.app/api";

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = tokenStorage.get();

  if (token) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    alertManager.show(message);

    return Promise.reject(error);
  }
);