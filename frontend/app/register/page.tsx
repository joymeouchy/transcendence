"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// import { isAuthenticated } from "@/lib/auth";
import { registerFields } from "../data/auth/registerFields";
import { useAuth } from "@/context/AuthContext";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "@/lib/validation";

import AuthLayout from "../components/auth/AuthLayout";
import AuthPanel from "../components/auth/AuthPanel";
import AuthField from "../components/auth/AuthField";
import AuthButton from "../components/auth/AuthButton";
import AuthLink from "../components/auth/AuthLink";
import XPAlert from "../components/ui/XPAlert/XPAlert";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationError =
      validateUsername(formData.username.trim()) ||
      validateEmail(formData.email.trim()) ||
      validatePassword(formData.password);
    if (validationError) {
      setAlertMessage(validationError);
      setShowAlert(true);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setAlertMessage("Passwords do not match");
      setShowAlert(true);
      return;
    }

    try {
      setLoading(true);

      await register(
        formData.username,
        formData.email,
        formData.password
      );

      setSuccessMessage("Registration successful");
      setShowSuccess(true);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthPanel>
        <form onSubmit={handleSubmit} className="xp-form flex flex-col items-stretch gap-2.5">
          <h3 className="xp-title text-xp-md font-bold">Register for Pong XP</h3>

          {registerFields.map((field) => (
            <AuthField
              key={field.key}
              id={field.key}
              name={field.key}
              autoComplete={field.type === "password" ? "new-password" : field.key}
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
            />
          ))}
          <AuthButton type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </AuthButton>
        </form>
        <AuthLink
          href={loading ? "#" : "/login"}
          className={loading ? "disabled" : ""}
          onClick={(e) => {
            if (loading) e.preventDefault();
          }}
        >
          Already a user? Login
        </AuthLink>
      </AuthPanel>
      <XPAlert
        isOpen={showSuccess}
        title="Success"
        message={successMessage}
        onClose={() => {
          setShowSuccess(false);
          setSuccessMessage("");
          router.replace("/home");
        }}
      />
      <XPAlert
        isOpen={showAlert}
        title="Error"
        message={alertMessage}
        onClose={() => {
          setShowAlert(false);
          setAlertMessage("");
        }}
      />
    </AuthLayout>
  );
}
