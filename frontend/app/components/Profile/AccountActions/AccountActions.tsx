"use client";

import { useRef, useState } from "react";

import ChangePasswordModal from "../ChangePasswordModal/ChangePasswordModal";
import ChangeProfilePictureModal from "../ChangeProfilePictureModal/ChangeProfilePictureModal";
import ChangeUsernameModal from "../ChangeUsernameModal/ChangeUsernameModal";

interface AccountActionsProps {
  provider?: string;
  username: string;

  isOwnProfile?: boolean;
  isFriend?: boolean;

  onAddFriend?: () => void | Promise<void>;
  onRemoveFriend?: () => void | Promise<void>;
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

  // add/remove friend: disabled until the request finishes; the ref also
  // stops a fast double click (state updates aren't immediate)
  const [friendActionPending, setFriendActionPending] = useState(false);
  const friendActionRef = useRef(false);

  const isGoogleAccount = provider === "google";

  async function runFriendAction(action?: () => void | Promise<void>) {
    if (!action || friendActionRef.current) return;

    friendActionRef.current = true;
    setFriendActionPending(true);

    try {
      await action();
    } finally {
      friendActionRef.current = false;
      setFriendActionPending(false);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-xp-sm max-[600px]:gap-xp-xs">
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
            onClick={() =>
              runFriendAction(isFriend ? onRemoveFriend : onAddFriend)
            }
            disabled={friendActionPending}
          >
            {friendActionPending
              ? isFriend ? "Removing..." : "Sending..."
              : isFriend ? "Remove Friend" : "Add Friend"}
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