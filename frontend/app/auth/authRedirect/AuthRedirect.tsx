"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

const guestOnlyRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

const protectedRoutes = [
  "/home",
  "/profile",
  "/friends",
  "/game",
  "/chats",
  "/gameStats",
  "/paint",
];
// /privacy-policy and /terms-of-service are in neither list: open to everyone.

const matches = (pathname: string, routes: string[]) =>
  routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

export default function AuthRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const hasToken = isAuthenticated();
    const isGuestRoute =
      pathname === "/" || matches(pathname, guestOnlyRoutes);
    const isProtectedRoute = matches(pathname, protectedRoutes);

    if (hasToken && isGuestRoute) {
      router.replace("/home");
      return;
    }

    if (!hasToken && isProtectedRoute) {
      router.replace("/");
    }
  }, [pathname, router]);

  return null;
}