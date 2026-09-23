import { Socket } from "socket.io-client";
import { Message } from "@/types/messages";

export function addMessageListener(
	socket: Socket,
	onMessage: (message: Message) => void
) {
	socket.on("receive_message", onMessage);
}

export function removeMessageListener(
	socket: Socket,
	onMessage: (message: Message) => void
) {
	socket.off("receive_message", onMessage);
}