"use client";

import XPModal from "../../ui/XPModal/XPModal";
import XPButton from "../../ui/XPButton/XPButton";

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
          <XPButton onClick={onStartOnline}>
            🎮 Play Online
          </XPButton>

          <XPButton onClick={onPlayFriend}>
            👥 Play Friend
          </XPButton>
        </div>

      </div>
    </XPModal>
  );
}