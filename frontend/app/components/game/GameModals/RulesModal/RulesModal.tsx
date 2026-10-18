"use client";

import XPModal from "../../../ui/XPModal/XPModal";
import { pongConfig, WINNING_SCORE_OPTIONS } from "@/types/game_types";

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
          🏓 Use WASD or Arrows to control your paddle and hit the ball back to your opponent.
        </p>

        <p>
          🎯 Score points by getting the ball past your opponent's paddle.
        </p>

        <p>
          🏆 The first player to reach <strong>{pongConfig.winningScore} points</strong> wins the match.
        </p>

        <p>
          🎚️ When you invite a friend, you can choose the max score: {WINNING_SCORE_OPTIONS.join(", ")} points.
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