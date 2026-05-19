"use client";

import React, { useState } from "react";
import Link from "next/link";
import "./page.scss";
import { authService } from "@/services/auth.services"; 
import { useRouter } from "next/navigation";
import { loginFields } from "../data/auth/loginFields";
import AuthLayout from "../components/auth/AuthLayout";
import AuthPanel from "../components/auth/AuthPanel";

export default function LoginPage() {
  const [formData, setFormData] = useState({
  email: "",
  password: "",
});
  const router = useRouter();

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
    ) => {
    e.preventDefault();

      try {
    const response = await authService.login({
      email: formData.email,
      password: formData.password,
    });
    console.log("Login success:", response);
    router.push("/");

    } catch (err: any) {
    console.error(err);

    alert(
      err.response?.data?.error ||
      "Login failed"
    );
    }
    // placeholders for testing
    console.log("Email:", formData.email);
    console.log("Password:", formData.password);
  };
  return (
  <AuthLayout>

    <AuthPanel>

      <form
        onSubmit={handleSubmit}
        className="xp-form"
      >

        <h3 className="xp-title">
          Log In to PONG
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
            />

          </div>
        ))}

        <button
          type="submit"
          className="xp-submit"
        >
          Log In
        </button>

      </form>
      <Link
        href="/register"
        className="xp-link"
      >
        Create a new account
      </Link>
    </AuthPanel>
  </AuthLayout>
);
}