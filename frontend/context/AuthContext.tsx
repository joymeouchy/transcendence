"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { authService } from "../services/auth.services";
import { UserService } from "../services/user.services";

import { UserProfile } from "@/types/types.dto";

type AuthContextType = {
  user: UserProfile | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Load current user from API
   */
  const refreshUser = async () => {
    try {
      const currentUser = await UserService.getMe();
      setUser(currentUser);
    } catch (error) {
      console.error(
        "Failed to fetch user:",
        error
      );

      setUser(null);
      authService.logout();
    }
  };

  // Restore session on refresh
  useEffect(() => {
    async function restoreSession() {
      const token = authService.getToken();

      if (token) {
        await refreshUser();
      }

      setLoading(false);
    }

    restoreSession();
  }, []);

  // Login
  const login = async (
    email: string,
    password: string
  ) => {
    await authService.login({
      email,
      password,
    });

    await refreshUser();
  };

  // Register
  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    await authService.register({
      username,
      email,
      password,
    });

    await refreshUser();
  };

  // Logout
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


// hook
export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return ctx;
}