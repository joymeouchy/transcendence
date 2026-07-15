"use client";

import XPModal from "../../ui/XPModal/XPModal";

import "./GameOverModal.scss";

type Props = {
  isOpen: boolean;

  winner: string;
  currentUser: string;

  scoreLeft: number;
  scoreRight: number;

  onRematch: () => void;
  onFindNew: () => void;
  onExit: () => void;
};

export default function GameOverModal({
  isOpen,
  winner,
  currentUser,
  scoreLeft,
  scoreRight,
  onRematch,
  onFindNew,
  onExit,
}: Props) {
  const won = winner === currentUser;

  return (
    <XPModal
      title="Match Complete"
      isOpen={isOpen}
    >
      <div className="game-over">
        <div className="icon">
          {won ? "🏆" : "🎮"}
        </div>

        <h2>
          {won
            ? "You Won!"
            : `${winner} Won!`}
        </h2>

        <div className="score">
          {scoreLeft} : {scoreRight}
        </div>

        <div className="buttons">
          <button onClick={onRematch}>
            Rematch
          </button>

          <button onClick={onFindNew}>
            Find New Opponent
          </button>

          <button onClick={onExit}>
            Return to Main Menu
          </button>
        </div>
      </div>
    </XPModal>
  );
}