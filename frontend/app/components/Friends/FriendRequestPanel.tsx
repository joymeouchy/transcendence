"use client";

import styles from "./FriendsPageTemplate/FriendsPageTemplate.module.scss"

import { FriendRequest } from "@/types/types.dto";

interface Props {
	requests: FriendRequest[];

	onAccept?: (id: number) => void;
	onReject?: (id: number) => void;
}

export default function FriendRequestsPanel({
	requests,
	onAccept,
	onReject,
}: Props) {
	return (
		<div className={styles.panel}>
			<div className={styles.title}>
				Friend Requests
			</div>

			<div className={styles.list}>
				{requests.length === 0 ? (
					<div className={styles.empty}>
						No requests
					</div>
				) : (
					requests.map((request) => (
						<div
							key={request.id}
							className={styles.friend}
						>
							<span>
								{request.sender.username}
							</span>

							<div className={styles.actions}>
								<button
									onClick={() =>
										onAccept?.(request.id)
									}
								>
									Accept
								</button>

								<button
									onClick={() =>
										onReject?.(request.id)
									}
								>
									Reject
								</button>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}