"use client";

import Link from "next/link";
import Image from "next/image";
import AuthLayout from "./components/auth/AuthLayout";
import AuthIcon from "./components/auth/AuthIcon";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isAuthenticated } from "@/lib/auth";

import "./page.scss";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/home");
    }
  }, []);

  return (
    <AuthLayout>
      <div className="xp-divider" />
      <div className="xp-auth-stack">
        <div className="xp-auth-card">
          <div className="xp-system-text"> To begin, select an option </div>
          <Link href="/login" className="xp-user-tile">
            <AuthIcon
              className="xp-auth-icon"
              src="/chess.jpg"
            />
            <div>
              <h3>Log In</h3>
              <p>Access existing account</p>
            </div> </Link>
        </div>

        <div className="xp-auth-card">
          <Link href="/register" className="xp-user-tile">
            <AuthIcon
              className="xp-auth-icon"
              src="/beach.jpg"
            /> <div>
              <h3>Register</h3> <p>Create new account</p>
            </div>
          </Link>
        </div>
      </div>

    </AuthLayout >
  );
}