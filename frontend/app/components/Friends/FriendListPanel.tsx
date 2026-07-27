"use client";

import { useState } from "react";

import { Friend } from "@/types/types.dto";

import styles from "./FriendsPageTemplate/FriendsPageTemplate.module.scss"

interface Props {
	friends: Friend[];

	onRemoveFriend?: (
		friendshipId: number
	) => Promise<void>;
}

export default function FriendsListPanel({
	friends,
	onRemoveFriend,
}: Props) {
	const [removingFriendId, setRemovingFriendId] =
		useState<number | null>(null);

	async function handleRemoveFriend(
		friendshipId: number
	) {
		try {
			setRemovingFriendId(friendshipId);

			await onRemoveFriend?.(friendshipId);
		} catch (err) {
			console.error(
				"Failed to remove friend:",
				err
			);
		} finally {
			setRemovingFriendId(null);
		}
	}

	return (
		<div className={styles.panel}>
			<div className={styles.title}>
				Friends
			</div>

			<div className={styles.list}>
				{friends.length === 0 ? (
					<div className={styles.empty}>
						No friends yet
					</div>
				) : (
					friends.map((friend) => (
						<div
							key={friend.friendshipId}
							className={styles.friend}
						>
							<div className={styles.user}>
								<span
									className={`${styles.dot} ${
										friend.isOnline
											? styles.online
											: styles.offline
									}`}
								/>

								{friend.username}
							</div>

							<button
								disabled={
									removingFriendId ===
									friend.friendshipId
								}
								onClick={() =>
									handleRemoveFriend(
										friend.friendshipId
									)
								}
							>
								{removingFriendId ===
								friend.friendshipId
									? "Removing..."
									: "Remove"}
							</button>
						</div>
					))
				)}
			</div>
		</div>
	);
}