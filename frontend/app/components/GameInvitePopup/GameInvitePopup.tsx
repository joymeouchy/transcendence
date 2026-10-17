"use client";

import { useRouter } from "next/navigation";

import InviteRequestModal from "../game/GameModals/InviteRequestModal/InviteRequestModal";
import JoiningGameModal from "../game/GameModals/JoiningGameModal/JoiningGameModal";
import { useGameInvite } from "@/context/GameInviteContext";
import { pongConfig } from "@/types/game_types";

export default function GameInvitePopup() {
  const router = useRouter();

  const {
    incomingInvite,
    respondToInvite,
    clearIncomingInvite,
    isJoiningGame,
  } = useGameInvite();

  const handleAccept = () => {
    if (!incomingInvite) return;

    const fromUserId = incomingInvite.fromUserId;

    router.push("/game");

    respondToInvite(fromUserId, true);
  };

  const handleDecline = () => {
    if (!incomingInvite) return;

    respondToInvite(incomingInvite.fromUserId, false);
  };

  return (
    <>
      <InviteRequestModal
        isOpen={incomingInvite !== null}
        username={incomingInvite?.fromUsername ?? ""}
        avatarUrl={incomingInvite?.fromAvatarUrl ?? null}
        winningScore={incomingInvite?.winningScore ?? 5}
        onAccept={() => {
          if (incomingInvite) {
            respondToInvite(incomingInvite.fromUserId, true);
          }
        }}
        onDecline={() => {
          if (incomingInvite) {
            respondToInvite(incomingInvite.fromUserId, false);
          }
        }}
        onClose={clearIncomingInvite}
      />

      <JoiningGameModal isOpen={isJoiningGame} />
    </>
  );
}
