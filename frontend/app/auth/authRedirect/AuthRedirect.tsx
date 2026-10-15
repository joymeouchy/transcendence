
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const publicRoutes = ["/", "/login", "/register"];

export default function AuthRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isPublicRoute = publicRoutes.includes(pathname);

    if (user && pathname === "/") {
    router.replace("/home");
    return;
   }
    if (!loading && !user && !isPublicRoute) {
      router.replace("/");
    }
  }, [user, loading, pathname, router]);

  return null;
}
