import { Friend } from "@/types/types.dto";

import styles from "./ChatHeader.module.scss";

interface Props {
	user: Friend;
}

export default function ChatHeader({
	user,
}: Props) {
	return (
		<div className={styles.header}>
			<div className={styles.avatar}>
				{user.avatarUrl ? (
					<img
						src={user.avatarUrl}
						alt={user.username}
					/>
				) : (
					user.username.charAt(0).toUpperCase()
				)}
			</div>

			<div className={styles.info}>
				<div className={styles.username}>
					{user.username}
				</div>

				<div className={styles.status}>
					<span
						className={
							user.isOnline
								? styles.online
								: styles.offline
						}
					/>

					{user.isOnline
						? "Online"
						: "Offline"}
				</div>
			</div>
		</div>
	);
}