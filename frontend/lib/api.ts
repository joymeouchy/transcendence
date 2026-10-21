import axios from "axios";
import { tokenStorage } from "./token";
import { alertManager } from "./alert";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://localhost:8443/api";

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

// Set by AuthContext: signs the user out when the token is rejected
let unauthorizedHandler: (() => void) | null = null;

export const setUnauthorizedHandler = (handler: (() => void) | null) => {
  unauthorizedHandler = handler;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only the JWT middleware answers 401, so a 401 on a request that
    // carried a token means it is invalid or expired
    if (
      error.response?.status === 401 &&
      error.config?.headers?.Authorization
    ) {
      unauthorizedHandler?.();
    }


    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    alertManager.show(message);

    return Promise.reject(error);
  }
);