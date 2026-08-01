"use client";

import { useState } from "react";

import XPModal from "../../ui/XPModal/XPModal";
import XPAlert from "../../ui/XPAlert/XPAlert";

import { UserService } from "@/services/user.services";
import { useAuth } from "@/context/AuthContext";

import styles from "./ChangeProfilePictureModal.module.scss";

type ChangeProfilePictureModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ChangeProfilePictureModal({
  isOpen,
  onClose,
}: ChangeProfilePictureModalProps) {
  const { refreshUser } = useAuth();

  const [file, setFile] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [showSuccess, setShowSuccess] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const resetForm = () => {
    setFile(null);
    setPreview("");
    setError("");
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile =
      e.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(
      URL.createObjectURL(selectedFile)
    );
  };

  const handleSubmit = async () => {
    setError("");

    if (!file) {
      setError(
        "Please select an image."
      );

      return;
    }

    try {
      setLoading(true);

      const { avatarUrl } =
        await UserService.uploadAvatar(file);

      await refreshUser();

      resetForm();
      onClose();

      setSuccessMessage(
        "Profile picture updated successfully."
      );

      setShowSuccess(true);

      console.log(
        "Avatar updated:",
        avatarUrl
      );
    } catch (err: any) {
      setError(
        err?.response?.data?.error ??
          "Failed to update profile picture."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <XPModal
        title="Change Profile Picture"
        isOpen={isOpen}
        onClose={handleClose}
      >
        <div className={styles.form}>
          <label>
            Select Image
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className={styles.preview}
            />
          )}

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
                ? "Uploading..."
                : "Save"}
            </button>
          </div>
        </div>
      </XPModal>

      <XPAlert
        isOpen={showSuccess}
        title="Success"
        message={successMessage}
        onClose={() => {
          setShowSuccess(false);
          setSuccessMessage("");
        }}
      />
    </>
  );
}