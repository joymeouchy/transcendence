"use client";

import { useState } from "react";

import ChangePasswordModal from "../ChangePasswordModal/ChangePasswordModal";
import ChangeProfilePictureModal from "../ChangeProfilePictureModal/ChangeProfilePictureModal";
import ChangeUsernameModal from "../ChangeUsernameModal/ChangeUsernameModal";

import styles from "./AccountActions.module.scss";

interface AccountActionsProps {
  provider?: string;
  username: string;

  isOwnProfile?: boolean;
  isFriend?: boolean;

  onAddFriend?: () => void;
  onRemoveFriend?: () => void;
}

export default function AccountActions({
  provider,
  username,
  isOwnProfile = false,
  isFriend = false,
  onAddFriend,
  onRemoveFriend,
}: AccountActionsProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showPicture, setShowPicture] = useState(false);
  const [showUsername, setShowUsername] = useState(false);

  const isGoogleAccount = provider === "google";

  return (
    <>
      <div className={styles.actions}>
        {isOwnProfile ? (
          <>
            <button
              onClick={() => setShowPicture(true)}
            >
              Change Profile Picture
            </button>

            <button
              onClick={() => setShowUsername(true)}
            >
              Change Username
            </button>

            {!isGoogleAccount && (
              <button
                onClick={() => setShowPassword(true)}
              >
                Change Password
              </button>
            )}
          </>
        ) : (
          <button
            onClick={
              isFriend
                ? onRemoveFriend
                : onAddFriend
            }
          >
            {isFriend ? "Remove Friend" : "Add Friend"}
          </button>
        )}
      </div>

      <ChangeProfilePictureModal
        isOpen={showPicture}
        onClose={() => setShowPicture(false)}
      />

      <ChangeUsernameModal
        isOpen={showUsername}
        onClose={() => setShowUsername(false)}
        currentUsername={username}
      />

      <ChangePasswordModal
        isOpen={showPassword}
        onClose={() => setShowPassword(false)}
      />
    </>
  );
}