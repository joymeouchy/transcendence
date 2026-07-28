"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import "./page.scss";

import { authService } from "@/services/auth.services";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

import { loginFields } from "../data/auth/loginFields";

import AuthLayout from "../components/auth/AuthLayout";
import AuthPanel from "../components/auth/AuthPanel";
import XPAlert from "../components/ui/XPAlert/XPAlert";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [alertMessage, setAlertMessage] =
    useState<string | null>(null);

  const [isLoading, setIsLoading] =
    useState(false);

  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/home");
    }
  }, []);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      console.log(
        "Login success:",
        response
      );

      router.push("/home");

    } catch (err: any) {
      console.error(err);

      setAlertMessage(
        err.response?.data?.error ||
        "Login failed"
      );

    } finally {
      setIsLoading(false);
    }

    console.log(
      "Email:",
      formData.email
    );

    console.log(
      "Password:",
      formData.password
    );
  };

  return (
    <AuthLayout>
      <AuthPanel>
        <form
          onSubmit={handleSubmit}
          className="xp-form"
        >
          <h3 className="xp-title">
            Log In to Pong XP
          </h3>

          {loginFields.map((field) => (
            <div
              key={field.key}
              className="xp-field"
            >
              <label className="xp-label">
                {field.label}
              </label>

              <input
                type={field.type}
                placeholder={field.placeholder}
                value={
                  formData[
                  field.key as keyof typeof formData
                  ]
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [
                      field.key as keyof typeof formData
                    ]: e.target.value,
                  }))
                }
                className="xp-input"
                required={field.required}
                disabled={isLoading}
              />
            </div>
          ))}
          
          <Link
            href="/forgot-password"
            className="xp-link"
          >
            Forgot password?
          </Link>

          <button
            type="submit"
            className="xp-submit"
            disabled={isLoading}
          >
            {isLoading
              ? "Logging in..."
              : "Log In"}
          </button>

          <button
            type="button"
            className="xp-submit"
            disabled={isLoading}
            onClick={
              authService.loginWithGoogle
            }
          >
            {isLoading
              ? "Please wait..."
              : "Log In with Google instead"}
          </button>
        </form>

        <Link
          href="/register"
          className="xp-link"
        >
          Create a new account
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