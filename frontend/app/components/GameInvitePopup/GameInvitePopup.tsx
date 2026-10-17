"use client";

import { useRouter } from "next/navigation";

import InviteRequestModal from "../game/GameModals/InviteRequestModal/InviteRequestModal";
import { useGameInvite } from "@/context/GameInviteContext";
import { pongConfig } from "@/types/game_types";

export default function GameInvitePopup() {
	const router = useRouter();

	const {
		incomingInvite,
		respondToInvite,
	} = useGameInvite();

	const handleAccept = () => {
		if (!incomingInvite) return;

		const fromUserId = incomingInvite.fromUserId;

		router.push("/game");
		
		respondToInvite(fromUserId, true);

	};

	const handleDecline = () => {
		if (!incomingInvite) return;

		respondToInvite(
			incomingInvite.fromUserId,
			false
		);
	};

	return (
		<InviteRequestModal
			isOpen={incomingInvite !== null}
			username={incomingInvite?.fromUsername ?? ""}
			avatarUrl={incomingInvite?.fromAvatarUrl ?? null}
			winningScore={incomingInvite?.winningScore ?? pongConfig.winningScore}
			onAccept={handleAccept}
			onDecline={handleDecline}
			onClose={handleDecline}
		/>
	); 
}