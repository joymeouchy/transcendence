"use client";

import { useEffect, useState } from "react";

import { socket } from "@/lib/socket";
import { Message } from "@/types/messages";

export default function useMessageSocket() {
	const [receivedMessage, setReceivedMessage] =
		useState<Message | null>(null);

	useEffect(() => {
		const handleReceiveMessage = (
			message: Message
		) => {
			setReceivedMessage(message);
		};
		socket.on(
			"receive_message",
			handleReceiveMessage
		);

		return () => {
			socket.off(
				"receive_message",
				handleReceiveMessage
			);
		};
	}, []);


	return {
		receivedMessage,
	};
}