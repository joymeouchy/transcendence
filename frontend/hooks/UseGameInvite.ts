"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";

export type IncomingInvite = {
	fromUserId: number;
	fromUsername: string;
	fromAvatarUrl: string | null;
	winningScore: number;
};

export default function useGameInvite() {
	const [incomingInvite, setIncomingInvite] =
		useState<IncomingInvite | null>(null);
const [isJoiningGame, setIsJoiningGame] = useState(false);

function respondToInvite(
  fromUserId: number,
  accepted: boolean
) {
  if (!socket.connected) return;

  if (accepted) {
    setIsJoiningGame(true);
  }

  socket.emit("invite_response", {
    fromUserId,
    accepted,
  });

  setIncomingInvite(null);
}

function clearJoiningGame() {
  setIsJoiningGame(false);
}
	useEffect(() => {
		const handleInviteReceived = (
			data: IncomingInvite
		) => {

			setIncomingInvite(data);
		};

		const handleInviteCancelled = (data: {
			fromUserId: number;
		}) => {

			setIncomingInvite((current) => {
				if (
					current?.fromUserId ===
					data.fromUserId
				) {
					return null;
				}

				return current;
			});
		};

		socket.on(
			"invite_received",
			handleInviteReceived
		);

		socket.on(
			"invite_cancelled",
			handleInviteCancelled
		);

		return () => {
			socket.off(
				"invite_received",
				handleInviteReceived
			);

			socket.off(
				"invite_cancelled",
				handleInviteCancelled
			);
		};
	}, []);

	function clearIncomingInvite() {
		setIncomingInvite(null);
	}

	return {
		incomingInvite,
		respondToInvite,
		clearIncomingInvite,
		isJoiningGame,
		clearJoiningGame,
	};
}