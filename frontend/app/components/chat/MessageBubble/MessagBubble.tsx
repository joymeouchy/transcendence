import { Message } from "../MessageList/MessageList";

import styles from "./MessageBubble.module.scss";

interface Props {
	message: Message;
	isMine: boolean;
}

export default function MessageBubble({
	message,
	isMine,
}: Props) {
	return (
		<div
			className={`${styles.row} ${
				isMine
					? styles.mine
					: styles.theirs
			}`}
		>
			<div className={styles.bubble}>
				<div className={styles.content}>
					{message.content}
				</div>

				<div className={styles.time}>
					{new Date(
						message.createdAt
					).toLocaleTimeString([], {
						hour: "2-digit",
						minute: "2-digit",
					})}
				</div>
			</div>
		</div>
	);
}