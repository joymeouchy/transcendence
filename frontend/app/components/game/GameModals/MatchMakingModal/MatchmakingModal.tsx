"use client";

import { useEffect, useState } from "react";

import XPModal from "../../../ui/XPModal/XPModal";

// import "./MatchmakingModal.scss";

export type MatchmakingStatus =
  | "searching"
  | "waitingFriend"
  | "found";

type Props = {
  isOpen: boolean;
  status: MatchmakingStatus;

  opponentName?: string;

  onCancel?: () => void;
};

export default function MatchmakingModal({
  isOpen,
  status,
  opponentName,
  onCancel,
}: Props) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    if (!isOpen || status === "found") {
      setDots("");
      return;
    }

    const interval = setInterval(() => {
      setDots((prev) => (prev.length === 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, [isOpen, status]);

  const content = {
    searching: {
      title: "Searching for Opponent",
      icon: "🎮",
      heading: `Searching${dots}`,
      message: "Looking for an available online player.",
      hint: "This usually takes only a few seconds.",
      showCancel: true,
    },

    waitingFriend: {
      title: "Waiting for Friend",
      icon: "👥",
      heading: `Waiting${dots}`,
      message: opponentName
        ? `Waiting for ${opponentName} to join...`
        : "Waiting for your friend to join...",
      hint: "You'll automatically enter the game once they connect.",
      showCancel: true,
    },

    found: {
      title: "Match Found",
      icon: "✅",
      heading: "Opponent Found!",
      message: opponentName
        ? `${opponentName} has joined the match.`
        : "Your opponent has joined.",
      hint: "Starting game...",
      showCancel: false,
    },
  }[status];

  return (
    <XPModal
      title={content.title}
      isOpen={isOpen}
      onClose={content.showCancel ? onCancel : undefined}
    >
      <div className="matchmaking-modal">
        <div className="matchmaking-modal__icon">
          {content.icon}
        </div>

        <h2>{content.heading}</h2>

        <p>{content.message}</p>

        <p className="hint">{content.hint}</p>

        {content.showCancel && (
          <div className="buttons">
            <button onClick={onCancel}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </XPModal>
  );
}