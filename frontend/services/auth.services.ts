import { api, API_URL } from "@/lib/api";
import { tokenStorage } from "@/lib/token";
import type {
  RegisterDto,
  LoginDto,
  AuthResponse,
} from "../types/auth.dto";

export const authService = {
  register: async (
    data: RegisterDto
  ): Promise<AuthResponse> => {
    const res = await api.post(
      "/auth/register",
      data
    );

    if (res.data.token) {
      tokenStorage.set(res.data.token);
    }

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

  /**
   * Request password reset email
   */
  forgotPassword: async (
    email: string
  ): Promise<{ message: string }> => {
    const res = await api.post(
      "/auth/forgot-password",
      {
        email,
      }
    );

    return res.data;
  },

  /**
   * Reset password using email token
   */
  resetPassword: async (
    token: string,
    newPassword: string
  ): Promise<{ message: string }> => {
    const res = await api.post(
      "/auth/reset-password",
      {
        token,
        newPassword,
      }
    );

    return res.data;
  },

  /**
   * Change password for authenticated user
   */
  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }> => {
    const res = await api.patch(
      "/auth/change-password",
      {
        currentPassword,
        newPassword,
      }
    );

    return res.data;
  },
};