// app/home/page.tsx

"use client";

import DesktopLayout from "../components/DesktopLayout/DesktopLayout";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <DesktopLayout>
      <div></div>
    </DesktopLayout>
  );
}