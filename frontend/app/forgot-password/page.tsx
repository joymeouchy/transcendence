"use client";

import React, { useState } from "react";

import { authService } from "@/services/auth.services";

import AuthLayout from "../components/auth/AuthLayout";
import AuthPanel from "../components/auth/AuthPanel";
import AuthField from "../components/auth/AuthField";
import AuthButton from "../components/auth/AuthButton";
import AuthLink from "../components/auth/AuthLink";
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

    } catch {
      // the api error popup already shows what went wrong

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthPanel>
        <form
          onSubmit={handleSubmit}
          className="xp-form flex flex-col items-stretch gap-2.5"
        >
          <h3 className="xp-title text-xp-md font-bold">
            Forgot Password
          </h3>
          <AuthField
            id="email"
            name="email"
            autoComplete="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
            disabled={isLoading}
          />
          <AuthButton
            type="submit"
            disabled={isLoading}
          >
            {isLoading
              ? "Sending..."
              : "Send Reset Link"}
          </AuthButton>
        </form>
        <AuthLink href="/login">
          Back to login
        </AuthLink>
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