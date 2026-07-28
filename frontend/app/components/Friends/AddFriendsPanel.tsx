"use client";

import { useEffect, useState } from "react";
import { UserService, UserSearchResult } from "@/services/user.services";

import styles from "./FriendsPageTemplate/FriendsPageTemplate.module.scss"

interface Props {
	onAddFriend?: (receiverId: number) => Promise<void>;
}

export default function AddFriendPanel({
	onAddFriend,
}: Props) {
	const [friendUsername, setFriendUsername] = useState("");
	const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
	const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);
	const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

	useEffect(() => {
		async function searchUsers() {
			if (!friendUsername.trim() || selectedUser) {
				setSearchResults([]);
				return;
			}

			try {
				const users = await UserService.search(friendUsername);
				setSearchResults(users);
			} catch (err) {
				console.error("Search failed:", err);
				setSearchResults([]);
			}
		}

		searchUsers();
	}, [friendUsername, selectedUser]);

	async function handleAddFriend() {
		if (!selectedUser) return;

		try {
			setLoadingMessage("Sending friend request...");

			await onAddFriend?.(selectedUser.id);

			setFriendUsername("");
			setSelectedUser(null);
			setSearchResults([]);
		} catch (err) {
			console.error("Failed to send friend request:", err);
		} finally {
			setLoadingMessage(null);
		}
	}

	return (
		<div className={styles.addFriend}>
			<div className={styles.searchBox}>
				<input
					type="text"
					placeholder="Search username..."
					value={friendUsername}
					onChange={(e) => {
						setFriendUsername(e.target.value);
						setSelectedUser(null);
					}}
				/>

				<button
					onClick={handleAddFriend}
					disabled={!selectedUser || loadingMessage !== null}
				>
					{loadingMessage ? "Please wait..." : "Add"}
				</button>
			</div>

			{searchResults.length > 0 && (
				<div className={styles.searchResults}>
					{searchResults.map((user) => (
						<div
							key={user.id}
							className={styles.searchItem}
							onClick={() => {
								setSelectedUser(user);
								setFriendUsername(user.username);
								setSearchResults([]);
							}}
						>
							<span
								className={`${styles.dot} ${
									user.isOnline
										? styles.online
										: styles.offline
								}`}
							/>

							{user.username}
						</div>
					))}
				</div>
			)}
		</div>
	);
}