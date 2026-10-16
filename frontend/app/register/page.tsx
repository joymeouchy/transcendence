"use client";

import Link from "next/link";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.services";
import { isAuthenticated } from "@/lib/auth";
import { registerFields } from "../data/auth/registerFields";
import { useAuth } from "@/context/AuthContext";

import AuthLayout from "../components/auth/AuthLayout";
import AuthPanel from "../components/auth/AuthPanel";
import XPAlert from "../components/ui/XPAlert/XPAlert";

export default function RegisterPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

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

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/home");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setAlertMessage("Passwords do not match");
      setShowAlert(true);
      return;
    }

    try {
      setLoading(true);

      await authService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      // Fetch the newly authenticated user's information
      await refreshUser();

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
        <form onSubmit={handleSubmit} className="xp-form">
          <h3 className="xp-title">Register for Pong XP</h3>

          {registerFields.map((field) => (
            <div key={field.key} className="xp-field">
              <label className="xp-label">{field.label}</label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={formData[field.key as keyof typeof formData]}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [field.key as keyof typeof formData]: e.target.value,
                  }))
                }
                className="xp-input"
                required={field.required}
              />
            </div>
          ))}
          <button type="submit" className="xp-submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <Link
          href={loading ? "#" : "/login"}
          className={`xp-link ${loading ? "disabled" : ""}`}
          onClick={(e) => {
            if (loading) e.preventDefault();
          }}
        >
          Already a user? Login
        </Link>
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
