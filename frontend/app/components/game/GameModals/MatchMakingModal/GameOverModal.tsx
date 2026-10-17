"use client";

import XPModal from "../../../ui/XPModal/XPModal";


type Props = {
  isOpen: boolean;
  winner: string;
  currentUser: string;
  scoreLeft: number;
  scoreRight: number;
  waitingRematch: boolean;
  rematchDeclined: boolean;
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
  rematchDeclined,
  onRematch,
  onFindNew,
  onExit,
}: Props) {
  const won = winner === currentUser;

  return (
    <XPModal
      title={rematchDeclined ? "Rematch Declined" : "Match Complete"}
      isOpen={isOpen}
	    onClose={onExit}
    >
      <div className="flex flex-col items-center gap-3.75">
        {rematchDeclined ? (
          <>
            <h2 className="m-0 text-xp-4xl">Rematch Declined</h2>

            <p className="rematch-declined-message">
              Your opponent declined your rematch request.
            </p>

            <div className="flex flex-row gap-1">
              <button onClick={onExit}>
                Return to Main Menu
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="m-0 text-xp-4xl">
              {won ? "You Won!" : `${winner} Won!`}
            </h2>

            <div className="text-xp-3xl font-bold">
              {scoreLeft} : {scoreRight}
            </div>

            <div className="flex flex-row gap-1">
              <button
                onClick={onRematch}
                disabled={waitingRematch}
              >
                {waitingRematch ? "Waiting..." : "Rematch"}
              </button>

              <button onClick={onFindNew}>
                Find New Opponent
              </button>

              <button onClick={onExit}>
                Return to Main Menu
              </button>
            </div>
          </>
        )}
      </div>
    </XPModal>
  );
}