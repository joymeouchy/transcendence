"use client";

import { useState } from "react";
import Link from "next/link";

import ChangePasswordModal from "../ChangePasswordModal/ChangePasswordModal";

import styles from "./AccountActions.module.scss";

type AccountActionsProps = {
  provider?: "local" | "google" | string;
};

export default function AccountActions({
  provider,
}: AccountActionsProps) {
  const [showChangePassword, setShowChangePassword] =
    useState(false);

  const isGoogleAccount = provider === "google";

  return (
    <>
      <div className={styles.container}>
        <Link
          href="/profile/edit"
          className={styles.link}
        >
          Edit Profile
        </Link>

        {isGoogleAccount ? (
          <>
            <span className={styles.disabledLink}>
              Change Password
            </span>

            <p className={styles.note}>
              Passwords for Google accounts are managed
              through Google.
            </p>
          </>
        ) : (
          <button
            type="button"
            className={styles.link}
            onClick={() =>
              setShowChangePassword(true)
            }
          >
            Change Password
          </button>
        )}
      </div>

      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() =>
          setShowChangePassword(false)
        }
      />
    </>
  );
}