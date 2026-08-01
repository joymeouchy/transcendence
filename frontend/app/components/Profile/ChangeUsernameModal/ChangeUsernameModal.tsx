"use client";

import { useState } from "react";

import XPModal from "../../ui/XPModal/XPModal";
import XPAlert from "../../ui/XPAlert/XPAlert";

import { UserService } from "@/services/user.services";
import { useAuth } from "@/context/AuthContext";

import styles from "./ChangeUsernameModal.module.scss";

type ChangeUsernameModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentUsername: string;
};

export default function ChangeUsernameModal({
  isOpen,
  onClose,
  currentUsername,
}: ChangeUsernameModalProps) {
  const { refreshUser } = useAuth();

  const [username, setUsername] =
    useState(currentUsername);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [showSuccess, setShowSuccess] =
    useState(false);

  const resetForm = () => {
    setUsername(currentUsername);
    setError("");
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    setError("");

    if (!username.trim()) {
      setError(
        "Username is required."
      );
      return;
    }

    if (username === currentUsername) {
      setError(
        "Please enter a different username."
      );
      return;
    }

    try {
      setLoading(true);

      await UserService.updateUsername(
        username.trim()
      );

      await refreshUser();

      resetForm();
      onClose();

      setShowSuccess(true);
    } catch (err: any) {
      setError(
        err?.response?.data?.error ??
          "Failed to update username."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <XPModal
        title="Change Username"
        isOpen={isOpen}
        onClose={handleClose}
      >
        <div className={styles.form}>
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
            />
          </label>

          {error && (
            <p className={styles.error}>
              {error}
            </p>
          )}

          <div className={styles.actions}>
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : "Save"}
            </button>
          </div>
        </div>
      </XPModal>

      <XPAlert
        isOpen={showSuccess}
        title="Success"
        message="Username updated successfully."
        onClose={() =>
          setShowSuccess(false)
        }
      />
    </>
  );
}