"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { authService } from "../services/auth.services";

type User = {
  userId: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔁 restore session on refresh
  useEffect(() => {
    const token = authService.getToken();
    const storedUserId = localStorage.getItem("userId");

    if (token && storedUserId) {
      setUser({ userId: storedUserId });
    }

    setLoading(false);
  }, []);

  // 🔐 LOGIN
  const login = async (email: string, password: string) => {
    const res = await authService.login({ email, password });

    setUser({ userId: res.userId });

    // persist minimal state
    localStorage.setItem("userId", res.userId);
  };

  // 📝 REGISTER
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
  };

  // 🚪 LOGOUT
  const logout = () => {
    authService.logout();
    setUser(null);
    localStorage.removeItem("userId");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
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
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return ctx;
}