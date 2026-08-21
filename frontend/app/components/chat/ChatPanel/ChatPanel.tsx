"use client";

import { Friend } from "@/types/types.dto";

import ChatHeader from "../ChatHeader/ChatHeader";
import MessageList, {
	Message,
} from "../MessageList/MessageList";
import ChatInput from "../ChatInput/ChatInput";

import styles from "./ChatPanel.module.scss";

interface Props {
	user: Friend;
	currentUserId: number;
	messages: Message[];
	onSendMessage?: (message: string) => void;
}

export default function ChatPanel({
	user,
	currentUserId,
	messages,
	onSendMessage,
}: Props) {
	return (
		<div className={styles.panel}>
			<ChatHeader user={user} />

			<MessageList
				messages={messages}
				currentUserId={currentUserId}
			/>

			<ChatInput
				onSend={
					onSendMessage ??
					(() => {})
				}
			/>
		</div>
	);
}