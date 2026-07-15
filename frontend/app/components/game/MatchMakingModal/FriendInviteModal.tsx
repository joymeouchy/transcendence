"use client";

import { useState } from "react";
import XPModal from "../../ui/XPModal/XPModal";

// import "./FriendInviteModal.scss";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (username: string) => void;
};

export default function FriendInviteModal({
  isOpen,
  onClose,
  onInvite,
}: Props) {
  const [username, setUsername] = useState("");

  function handleInvite() {
    if (!username.trim()) return;

    onInvite(username.trim());
  }

  return (
    <XPModal
      title="Play with Friend"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="friend-modal">
        <p>
          Enter your friend's username.
        </p>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <div className="buttons">
          <button onClick={handleInvite}>
            Invite
          </button>
        </div>
      </div>
    </XPModal>
  );
}