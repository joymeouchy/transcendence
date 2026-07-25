"use client";

import XPModal from "../../ui/XPModal/XPModal";

import "./MatchSelectModal.scss";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onStartOnline: () => void;
  onPlayFriend: () => void;
};

export default function MatchSelectModal({
  isOpen,
  onClose,
  onStartOnline,
  onPlayFriend,
}: Props) {
  return (
    <XPModal
      title="Play Pong"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="match-select">

        <div className="match-select__header">
          <p>
            Welcome to Pong!
          </p>

          <span>
            Choose a game mode to start playing.
          </span>
        </div>


        <div className="mode-buttons">
          <button onClick={onStartOnline}>
            🎮 Play Online
          </button>

          <button onClick={onPlayFriend}>
            👥 Play Friend
          </button>
        </div>

      </div>
    </XPModal>
  );
}