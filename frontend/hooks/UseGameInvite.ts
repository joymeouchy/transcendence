"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";

export type IncomingInvite = {
	fromUserId: number;
	fromUsername: string;
	fromAvatarUrl: string | null;
};

export default function useGameInvite() {
	const [incomingInvite, setIncomingInvite] =
		useState<IncomingInvite | null>(null);

	useEffect(() => {
		const handleInviteReceived = (
			data: IncomingInvite
		) => {
			console.log(
				"Friend invite received:",
				data
			);

			setIncomingInvite(data);
		};

		const handleInviteCancelled = (data: {
			fromUserId: number;
		}) => {
			console.log(
				"Invite cancelled:",
				data
			);

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

	function respondToInvite(
		fromUserId: number,
		accepted: boolean
	) {
		if (!socket.connected) return;

		socket.emit("invite_response", {
			fromUserId,
			accepted,
		});

		setIncomingInvite(null);
	}

	function clearIncomingInvite() {
		setIncomingInvite(null);
	}

	return {
		incomingInvite,
		respondToInvite,
		clearIncomingInvite,
	};
}