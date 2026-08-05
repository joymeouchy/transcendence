"use client";

import React, { useState } from "react";
import Link from "next/link";

import { authService } from "@/services/auth.services";

import AuthLayout from "../components/auth/AuthLayout";
import AuthPanel from "../components/auth/AuthPanel";
import XPAlert from "../components/ui/XPAlert/XPAlert";


export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const [alertMessage, setAlertMessage] =
    useState<string | null>(null);

  const [isLoading, setIsLoading] =
    useState(false);


  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const res =
        await authService.forgotPassword(email);

      setAlertMessage(res.message);

    } catch (err: any) {
      setAlertMessage(
        err.response?.data?.error ||
        "Something went wrong"
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
            Forgot Password
          </h3>


          <div className="xp-field">

            <label className="xp-label">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
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
              ? "Sending..."
              : "Send Reset Link"}
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