"use client";

import { useState } from "react";

import { Friend } from "@/types/types.dto";

import styles from "./FriendListPanel.module.scss";

interface Props {
	friends: Friend[];

	onRemoveFriend?: (
		friendshipId: number
	) => Promise<void>;

	onSelectFriend?: (
		friend: Friend
	) => void;

	selectedFriendId?: number;
	unreadCounts?: Record<number, number>;
}

export default function FriendsListPanel({
	friends,
	onRemoveFriend,
	onSelectFriend,
	selectedFriendId,
	unreadCounts,
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
					friends.map((friend) => {
						const unreadCount =
							unreadCounts?.[friend.id] ?? 0;

						return (
							<div
								key={friend.friendshipId}
								className={`${styles.friend} ${selectedFriendId === friend.id
										? styles.selected
										: ""
									}`}
								onClick={() =>
									onSelectFriend?.(friend)
								}
							>
								<div className={styles.user}>
									<span
										className={`${styles.dot} ${friend.isOnline
												? styles.online
												: styles.offline
											}`}
									/>
									{friend.username}
								</div>

								{unreadCount > 0 && (
									<span className={styles.unread}>
										{unreadCount}
									</span>
								)}

								{onRemoveFriend && (
									<button
										className={
											styles.friendButton
										}
										disabled={
											removingFriendId ===
											friend.friendshipId
										}
										onClick={(e) => {
											e.stopPropagation();

											handleRemoveFriend(
												friend.friendshipId
											);
										}}
									>
										{removingFriendId ===
											friend.friendshipId
											? "Removing..."
											: "Remove"}
									</button>
								)}
							</div>
						);
					})
				)}
			</div>
		</div>
	);
}