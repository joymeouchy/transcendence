"use client";

import XPModal from "../../ui/XPModal/XPModal";

// import "./OpponentDisconnectedModal.scss";

type Props = {
  isOpen: boolean;
  onFindAnother: () => void;
  onExit: () => void;
};

export default function OpponentDisconnectedModal({
  isOpen,
  onFindAnother,
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
          The match ended because your opponent
          left the game.
        </p>

        <div className="buttons">
          <button onClick={onFindAnother}>
            Find Another Player
          </button>

          <button onClick={onExit}>
            Return to Main Menu
          </button>
        </div>
      </div>
    </XPModal>
  );
}