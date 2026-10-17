"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// Replace with your real top-level protected routes
const protectedRoutes = ["/home", "/profile", "/friends", "/game", "/chat", "/settings"];

// Pages only for logged-out users
const guestOnlyRoutes = ["/forgot-password", "/reset-password"];

const matches = (pathname: string, routes: string[]) =>
  routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

export default function AuthRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (user && (pathname === "/" || matches(pathname, guestOnlyRoutes))) {
      router.replace("/home");
      return;
    }

    if (!user && matches(pathname, protectedRoutes)) {
      router.replace("/");
    }
  }, [user, loading, pathname, router]);

  return null;
}