"use client";

import React, { Suspense, useEffect, useState } from "react";

import { authService } from "@/services/auth.services";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";

import { loginFields } from "../data/auth/loginFields";

import AuthLayout from "../components/auth/AuthLayout";
import AuthPanel from "../components/auth/AuthPanel";
import AuthField from "../components/auth/AuthField";
import AuthButton from "../components/auth/AuthButton";
import AuthLink from "../components/auth/AuthLink";
import GoogleAuthError from "../GoogleAuthError/GoogleAuthError";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const { login } = useAuth();

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/home");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      router.push("/home");
    } catch (err: any) {
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <AuthLayout>
      <AuthPanel>
        <Suspense fallback={null}>
          <GoogleAuthError />
        </Suspense>
        <form
          onSubmit={handleSubmit}
          className="xp-form flex flex-col items-stretch gap-2.5"
        >
          <h3 className="xp-title text-xp-md font-bold">Log In to Pong XP</h3>

          {loginFields.map((field) => (
            <AuthField
              key={field.key}
              label={field.label}
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.key as keyof typeof formData]}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [field.key as keyof typeof formData]: e.target.value,
                }))
              }
              required={field.required}
              disabled={isLoading}
            />
          ))}

          <AuthButton type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Log In"}
          </AuthButton>

          <AuthButton
            type="button"
            disabled={isLoading}
            onClick={authService.loginWithGoogle}
          >
            {isLoading ? "Please wait..." : "Log In with Google instead"}
          </AuthButton>
        </form>

        <AuthLink href="/forgot-password">Forgot password?</AuthLink>

        <AuthLink href="/register">Create a new account</AuthLink>
      </AuthPanel>
    </AuthLayout>
  );
}
