"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  useSearchParams,
  useRouter,
} from "next/navigation";

import { authService } from "@/services/auth.services";

import AuthLayout from "../components/auth/AuthLayout";
import AuthPanel from "../components/auth/AuthPanel";
import XPAlert from "../components/ui/XPAlert/XPAlert";

// import "../login/page.scss";


export default function ResetPasswordPage() {

  const router = useRouter();

  const searchParams =
    useSearchParams();

  const token =
    searchParams.get("token");


  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [alertMessage, setAlertMessage] =
    useState<string | null>(null);

  const [isLoading, setIsLoading] =
    useState(false);



  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();


    if (!token) {
      setAlertMessage(
        "Invalid reset link"
      );
      return;
    }


    if (password !== confirmPassword) {
      setAlertMessage(
        "Passwords do not match"
      );
      return;
    }


    setIsLoading(true);


    try {

      const res =
        await authService.resetPassword(
          token,
          password
        );


      setAlertMessage(
        res.message
      );


      setTimeout(() => {
        router.push("/login");
      }, 1500);


    } catch (err: any) {

      setAlertMessage(
        err.response?.data?.error ||
        "Invalid or expired reset link"
      );

    } finally {

      setIsLoading(false);

    }

  };


  return (
    <AuthLayout>

      <AuthPanel>

        <form
          onSubmit={handleSubmit}
          className="xp-form"
        >

          <h3 className="xp-title">
            Reset Password
          </h3>


          <div className="xp-field">

            <label className="xp-label">
              New Password
            </label>

            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="xp-input"
              required
              disabled={isLoading}
            />

          </div>


          <div className="xp-field">

            <label className="xp-label">
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              className="xp-input"
              required
              disabled={isLoading}
            />

          </div>


          <button
            type="submit"
            className="xp-submit"
            disabled={isLoading}
          >
            {isLoading
              ? "Resetting..."
              : "Reset Password"}
          </button>


        </form>


        <Link
          href="/login"
          className="xp-link"
        >
          Back to login
        </Link>


      </AuthPanel>


      <XPAlert
        isOpen={
          alertMessage !== null
        }
        message={
          alertMessage ?? ""
        }
        onClose={() =>
          setAlertMessage(null)
        }
      />

    </AuthLayout>
  );
}