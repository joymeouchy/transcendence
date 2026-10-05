"use client";

import XPModal from "../../../ui/XPModal/XPModal";

// import "./OpponentDisconnectedModal.scss";

type Props = {
  isOpen: boolean;
  onExit: () => void;
};

export default function OpponentDisconnectedModal({
  isOpen,
  onExit,
}: Props) {
  return (
    <XPModal
      title="Connection Lost"
      isOpen={isOpen}
    >
      <div className="disconnect-modal">
        <div className="icon">⚠️</div>

        <h2>Opponent Disconnected</h2>

        <p>
          Your opponent has disconnected.
        </p>

        <p>
          The game is paused while we wait for them
          to reconnect.
        </p>

        <div className="buttons">
          <button onClick={onExit}>
            Leave Game
          </button>
        </div>
      </div>
    </XPModal>
  );
}