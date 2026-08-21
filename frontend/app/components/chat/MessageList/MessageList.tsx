import MessageBubble from "../MessageBubble/MessagBubble";

import styles from "./MessageList.module.scss";

export interface Message {
	id: number;
	senderId: number;
	content: string;
	createdAt: string;
}

interface Props {
	messages: Message[];
	currentUserId: number;
}

export default function MessageList({
	messages,
	currentUserId,
}: Props) {
	return (
		<div className={styles.list}>
			{messages.map((message) => (
				<MessageBubble
					key={message.id}
					message={message}
					isMine={
						message.senderId ===
						currentUserId
					}
				/>
			))}
		</div>
	);
}