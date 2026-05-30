import { api, API_URL } from "@/lib/api";
import { tokenStorage } from "@/lib/token";
import type { RegisterDto, LoginDto, AuthResponse } from "../types/auth.dto";


export const authService = {
  register: async (
    data: RegisterDto
  ): Promise<AuthResponse> => {
    const res = await api.post(
      "/auth/register",
      data
    );
    return res.data;
  },

  login: async (
    data: LoginDto
  ): Promise<AuthResponse> => {
    const res = await api.post(
      "/auth/login",
      data
    );

    if (res.data.token) {
      tokenStorage.set(res.data.token);
    }

    return res.data;
  },
  
  loginWithGoogle: () => {
    window.location.href =
      `${API_URL}/auth/google`;
  },

  logout: () => {
    tokenStorage.remove();
  },

  getToken: () => tokenStorage.get(),
};