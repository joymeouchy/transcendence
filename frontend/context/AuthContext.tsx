"use client";
import axios from "axios";


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

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<UserProfile | null>(null);

  const [loading, setLoading] =
    useState(true);

  /**
   * Load current authenticated user
   */

  const refreshUser = async () => {
  try {
    const token = authService.getToken();

    if (!token) {
      setUser(null);
      return;
    }

    const currentUser = await UserService.getMe();
    setUser(currentUser);

  } catch (error) {
    console.error("Failed to fetch user:", error);
    setUser(null);
  }
};


/**
 * Restore session after page refresh
 */
useEffect(() => {
  let mounted = true;
  async function restoreSession() {
    try {
      await refreshUser();
    } finally {
      if (mounted) {
        setLoading(false);
      }
    }
  }
  restoreSession();
  return () => {
    mounted = false;
  };
}, []);

const login = async (
  email: string,
  password: string
) => {
  const response = await authService.login({
    email,
    password,
  });
  const currentUser = await UserService.getMe();
  setUser(currentUser);
};
/**
 * Register
 */
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

/**
 * Logout
 */
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


/**
 * Auth hook
 */
export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return ctx;
}