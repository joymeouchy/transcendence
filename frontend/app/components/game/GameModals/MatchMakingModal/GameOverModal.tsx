"use client";

import XPModal from "../../../ui/XPModal/XPModal";

import "./GameOverModal.scss";

type Props = {
  isOpen: boolean;

  winner: string;
  currentUser: string;

  scoreLeft: number;
  scoreRight: number;

  waitingRematch: boolean;

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
  waitingRematch,
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

        <h2>
          {won
            ? "You Won!"
            : `${winner} Won!`}
        </h2>


        <div className="score">
          {scoreLeft} : {scoreRight}
        </div>


        <div className="buttons">

          <button
            onClick={onRematch}
            disabled={waitingRematch}
          >
            {waitingRematch
              ? "Waiting..."
              : "Rematch"}
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