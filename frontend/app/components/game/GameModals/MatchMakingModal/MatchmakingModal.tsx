"use client";

import { useEffect, useState } from "react";

import XPModal from "../../../ui/XPModal/XPModal";

// import "./MatchmakingModal.scss";

export type MatchmakingStatus =
  | "searching"
  | "waitingFriend"
  | "found"
  | "inviteRejected"
  | "inviteTimeout"
  | "inviteBusy";

type Props = {
  isOpen: boolean;
  status: MatchmakingStatus;

  opponentName?: string;

  onCancel?: () => void;
  onCancelInvite?: () => void;
  onInviteResultClose?: () => void;
};

export default function MatchmakingModal({
  isOpen,
  status,
  opponentName,
  onCancel,
  onCancelInvite,
  onInviteResultClose,
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
    inviteRejected: {
      title: "Invite Rejected",
      icon: "❌",
      heading: "Invite Rejected",
      message: opponentName
        ? `${opponentName} rejected your game invite.`
        : "Your friend rejected your game invite.",
      hint: "You can go back to the main menu and invite another friend.",
      showCancel: false,
    },

    inviteTimeout: {
      title: "Invite Timeout",
      icon: "⏰",
      heading: "Invite Timed Out",
      message: opponentName
        ? `${opponentName} did not respond to your invite.`
        : "Your friend did not respond to the invite.",
      hint: "You can go back to the main menu and invite another friend.",
      showCancel: false,
    },
    inviteBusy: {
      title: "Friend Unavailable",
      icon: "⚠️",
      heading: "Friend Unavailable",
      message: opponentName
        ? `${opponentName} is currently busy and cannot be invited.`
        : "Your friend is currently busy and cannot be invited.",
      hint: "You can go back to the main menu and choose another friend.",
      showCancel: false,
    },
  }[status];

  return (
    <XPModal
      title={content.title}
      isOpen={isOpen}
      onClose={
        status === "inviteRejected" ||
          status === "inviteTimeout" ||
          status === "inviteBusy"
          ? onInviteResultClose
          : content.showCancel
            ? status === "waitingFriend"
              ? onCancelInvite
              : onCancel
            : undefined
      }
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
            <button
              onClick={
                status === "waitingFriend"
                  ? onCancelInvite
                  : onCancel
              }
            >
              Cancel
            </button>
          </div>
        )}
        {(status === "inviteRejected" ||
          status === "inviteTimeout" ||
          status === "inviteBusy") && (
            <div className="buttons">
              <button onClick={onInviteResultClose}>
                Back to Main Menu
              </button>
            </div>
          )}
      </div>
    </XPModal>
  );
}