import { useEffect, useRef } from "react";

import MessageBubble from "../MessageBubble/MessagBubble";

import styles from "./MessageList.module.scss";

import { Message } from "@/types/messages";

interface Props {
	messages: Message[];
	currentUserId: number;
	messagesLoading?: boolean;
}

export default function MessageList({
	messages,
	currentUserId,
	messagesLoading,
}: Props) {
	const listRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		listRef.current?.scrollTo({
			top: listRef.current.scrollHeight,
			behavior: "smooth",
		});
	}, [messages]);

	return (
		<div
			ref={listRef}
			className={styles.list}
		>
			{messagesLoading ? (
				<div>Loading messages...</div>
			) : (
				messages.map((message) => (
					<MessageBubble
						key={message.id}
						message={message}
						isMine={
							message.senderId ===
							currentUserId
						}
					/>
				))
			)}
		</div>
	);
}