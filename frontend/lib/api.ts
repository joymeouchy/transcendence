import axios from "axios";
import { tokenStorage } from "./token";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3001";

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