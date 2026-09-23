"use client";
import axios from "axios";


import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useOnlineSocket } from "@/services/useOnlineSocket";

import { authService } from "../services/auth.services";
import { UserService } from "../services/user.services";

import { UserProfile } from "@/types/types.dto";
import { playSound, sounds } from "@/lib/sounds";
import { socket } from "@/lib/socket";

type AuthContextType = {
  user: UserProfile | null;
  loading: boolean;
  onlineUsers: Record<number, boolean>;

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
  const { onlineUsers } = useOnlineSocket();

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

/**
 * Keep the socket connection in sync with auth state, so
 * isOnline and live features work app-wide instead of only on
 * pages that happen to open the socket themselves.
 */
useEffect(() => {
  if (user) {
    socket.connect();
  } else {
    socket.disconnect();
  }
}, [user]);

useEffect(() => {
	if (!user) return;

	const liveStatus = onlineUsers[user.id];

	if (liveStatus === undefined) return;

	setUser((currentUser) => {
		if (!currentUser) return currentUser;

		if (currentUser.isOnline === liveStatus) {
			return currentUser;
		}

		return {
			...currentUser,
			isOnline: liveStatus,
		};
	});
}, [onlineUsers, user?.id]);

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
  playSound(sounds.startup);
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
      onlineUsers,
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