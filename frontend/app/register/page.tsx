"use client";

import Link from "next/link";
import { useState } from "react";

import { authService } from "@/services/auth.services";

import AuthLayout from "../components/auth/AuthLayout";
import AuthPanel from "../components/auth/AuthPanel";

import { registerFields } from "../data/auth/registerFields";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isAuthenticated } from "@/lib/auth";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

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

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response =
        await authService.register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });

      console.log(
        "Register success:",
        response
      );
       alert("Registration Successful");
      router.replace("/home");

    } catch (err: any) {
      console.error(err);
      console.error(err.response?.data);

      alert(
        err.response?.data?.message ||
        "Registration failed"
      );
    }

    // console.log(
    //   "Username:",
    //   formData.username
    // );

    // console.log(
    //   "Email:",
    //   formData.email
    // );

    // console.log(
    //   "Password:",
    //   formData.password
    // );

    // console.log(
    //   "Confirmed Password:",
    //   formData.confirmPassword
    // );
  };

  return (
    <AuthLayout>

      <AuthPanel>

        <form
          onSubmit={handleSubmit}
          className="xp-form"
        >

          <h3 className="xp-title">
            Register for PONG
          </h3>

          {registerFields.map((field) => (
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
            Register
          </button>

        </form>

        <Link
          href="/login"
          className="xp-link"
        >
          Already a user? Login
        </Link>

      </AuthPanel>
    </AuthLayout>
  );
}