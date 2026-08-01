"use client";

import { useState } from "react";

import ChangePasswordModal from "../ChangePasswordModal/ChangePasswordModal";
import ChangeProfilePictureModal from "../ChangeProfilePictureModal/ChangeProfilePictureModal";
import ChangeUsernameModal from "../ChangeUsernameModal/ChangeUsernameModal";

import styles from "./AccountActions.module.scss";

type AccountActionsProps = {
  provider?: "local" | "google" | string;
  username: string;
};

export default function AccountActions({
  provider,
  username,
}: AccountActionsProps) {
  const [showPassword, setShowPassword] =
    useState(false);

  const [showPicture, setShowPicture] =
    useState(false);

  const [showUsername, setShowUsername] =
    useState(false);

  const isGoogleAccount =
    provider === "google";

  return (
    <>
      <div className={styles.container}>
        <button
          className={styles.link}
          onClick={() =>
            setShowPicture(true)
          }
        >
          Change Profile Picture
        </button>

        <button
          className={styles.link}
          onClick={() =>
            setShowUsername(true)
          }
        >
          Change Username
        </button>

        {isGoogleAccount ? (
          <>
            <span className={styles.disabledLink}>
              Change Password
            </span>

            <p className={styles.note}>
              Passwords for Google accounts are managed through Google.
            </p>
          </>
        ) : (
          <button
            className={styles.link}
            onClick={() =>
              setShowPassword(true)
            }
          >
            Change Password
          </button>
        )}
      </div>

      <ChangeProfilePictureModal
        isOpen={showPicture}
        onClose={() =>
          setShowPicture(false)
        }
      />

      <ChangeUsernameModal
        isOpen={showUsername}
        onClose={() =>
          setShowUsername(false)
        }
        currentUsername={username}
      />

      <ChangePasswordModal
        isOpen={showPassword}
        onClose={() =>
          setShowPassword(false)
        }
      />
    </>
  );
}