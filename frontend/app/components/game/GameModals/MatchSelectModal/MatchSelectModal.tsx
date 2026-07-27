"use client";

import XPModal from "../../../ui/XPModal/XPModal";

import "./MatchSelectModal.scss";

type Props = {
  isOpen: boolean;
  onBack: () => void;
  onStartOnline: () => void;
  onPlayFriend: () => void;
  onReturnHome: () => void;
};

export default function MatchSelectModal({
  isOpen,
  onBack,
  onStartOnline,
  onPlayFriend,
  onReturnHome,
}: Props) {
  return (
    <XPModal
      title="Play Pong"
      isOpen={isOpen}
      onClose={onBack}
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

        <div className="return-button">
          <button onClick={onReturnHome}>
            🏠 Return to Homepage
          </button>
        </div>

      </div>
    </XPModal>
  );
}