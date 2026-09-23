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
			console.log(
				"Message received:",
				message
			);

			setReceivedMessage(message);
		};

		console.log("useMessageSocket mounted");
		console.log("Socket connected:", socket.connected);
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