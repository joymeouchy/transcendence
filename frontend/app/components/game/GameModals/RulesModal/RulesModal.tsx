"use client";

import XPModal from "../../../ui/XPModal/XPModal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function RulesModal({
  isOpen,
  onClose,
}: Props) {
  return (
    <XPModal
      title="Pong Rules"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pong-rules">

        <h3>
          How to Play
        </h3>

        <p>
          🏓 Control your paddle and hit the ball back to your opponent.
        </p>

        <p>
          🎯 Score points by getting the ball past your opponent's paddle.
        </p>

        <p>
          🏆 The first player to reach <strong>5 points</strong> wins the match.
        </p>

        <p>
          ⚡ Power-ups will randomly appear during the game.
        </p>

        <p>
          🎲 A power-up can affect a player or the game itself.
        </p>

        <p>
          ⏳ A countdown will appear in the middle of the screen to announce an upcoming power-up.
        </p>

        <p>
          ⚔️ Use your skills and adapt quickly to changing game conditions!
        </p>

      </div>
    </XPModal>
  );
}