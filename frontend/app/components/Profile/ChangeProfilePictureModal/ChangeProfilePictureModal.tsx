"use client";

import { useState } from "react";

import XPModal from "../../ui/XPModal/XPModal";
import XPAlert from "../../ui/XPAlert/XPAlert";

import { UserService } from "@/services/user.services";
import { useAuth } from "@/context/AuthContext";

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
    } catch (err: any) {
      setError(
        err?.response?.data?.error ??
        "Failed to update profile picture."
      );
    } finally {
      setLoading(false);
    }
  };
  const handleReset = async () => {
    setError("");

    try {
      setLoading(true);

      await UserService.deleteAvatar();
      await refreshUser();

      resetForm();
      onClose();

      setSuccessMessage("Profile picture reset to default.");
      setShowSuccess(true);
    } catch (err: any) {
      setError(
        err?.response?.data?.error ??
        "Failed to reset profile picture."
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
        <div className="flex min-w-75 flex-col items-center gap-5 p-5">
          <label className="flex flex-col items-center gap-2.5 text-xp-lg">
            Select Image
            <input
              className="w-auto"
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="size-30 rounded-xp-sm object-cover"
            />
          )}

          {error && (
            <p>
              {error}
            </p>
          )}

          <div className="mt-2.5 flex w-full items-center justify-center gap-5">
            <button
              className="h-7.5 w-22.5 cursor-pointer text-xp-md"
              type="button"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              className="h-7.5 w-22.5 cursor-pointer text-xp-md"
              type="button"
              onClick={handleReset}
              disabled={loading}
            >
              {loading ? "Please wait..." : "Reset to Default"}
            </button>

            <button
              className="h-7.5 w-22.5 cursor-pointer text-xp-md"
              type="button"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Uploading..." : "Save"}
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