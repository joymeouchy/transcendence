
"use client";

import DesktopLayout from "../components/DesktopLayout/DesktopLayout";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <DesktopLayout>
      <div></div>
    </DesktopLayout>
  );
}