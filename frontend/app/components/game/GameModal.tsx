"use client";

import "./../../game/page.module.scss";

type Props = {
  onPlay: () => void;
};

export default function GameModal({ onPlay }: Props) {
  return (
    <div className="game-modal">
      <div className="modal-box">
        <h2>Ready to Play?</h2>

        <button onClick={onPlay}>
          Play
        </button>
      </div>
    </div>
  );
}