"use client";

import { useEffect, useRef, useState } from "react";
import { UserService, UserSearchResult } from "@/services/user.services";
import { useAlert } from "@/context/AlertContext";

import clsx from "clsx";
import styles from "./AddFriendsPanel.module.scss";
import XPStatusDot from "../../ui/XPStatusDot/XPStatusDot";

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
	// state updates aren't immediate: this blocks a fast double click from sending twice
	const sendingRef = useRef(false);
	const { showAlert } = useAlert();

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
				setSearchResults([]);
			}
		}

		searchUsers();
	}, [friendUsername, selectedUser]);

	async function handleAddFriend() {
		if (!selectedUser || sendingRef.current) return;

		const receiver = selectedUser;

		try {
			sendingRef.current = true;
			setLoadingMessage("Sending friend request...");

			await onAddFriend?.(receiver.id);

			setFriendUsername("");
			setSelectedUser(null);
			setSearchResults([]);
			showAlert(`Friend request sent to ${receiver.username}.`);
		} catch (err) {
			// keep the selection so the user can retry; the error popup comes from the api layer
		} finally {
			sendingRef.current = false;
			setLoadingMessage(null);
		}
	}

	return (
		<div className="relative w-full">
			<div className="flex w-full gap-1.25 bg-xp-tint-blue p-1.75 max-[450px]:p-1.5">
				<input
					className={clsx(
						styles.searchInput,
						"h-6 min-w-0 flex-1 rounded-xp-2xs px-1.5 py-0.75 font-xp text-xp-sm outline-none",
					)}
					type="text"
					name="friendSearch"
					autoComplete="off"
					placeholder="Search username..."
					value={friendUsername}
					disabled={loadingMessage !== null}
					onChange={(e) => {
						setFriendUsername(e.target.value);
						setSelectedUser(null);
					}}
				/>

				<button
					className={clsx(
						styles.searchButton,
						"h-6 shrink-0 grow-0 basis-19.5 px-1.5 py-0.75 font-xp text-xp-sm whitespace-nowrap text-xp-ink max-[450px]:basis-17.5",
					)}
					onClick={handleAddFriend}
					disabled={!selectedUser || loadingMessage !== null}
				>
					{loadingMessage ? "Please Wait..." : "Add"}
				</button>
			</div>

			{searchResults.length > 0 && (
				<div className={clsx(styles.searchResults, "absolute top-full left-0 z-20 max-h-45 w-full overflow-x-hidden overflow-y-auto bg-xp-white")}>
					{searchResults.map((user) => (
						<div
							key={user.id}
							className={clsx(
								styles.searchItem,
								"flex cursor-pointer items-center gap-2 truncate px-2 py-1.5 font-xp text-xp-sm text-xp-gray-900",
							)}
							onClick={() => {
								setSelectedUser(user);
								setFriendUsername(user.username);
								setSearchResults([]);
							}}
						>
							<XPStatusDot online={user.isOnline} />

							{user.username}
						</div>
					))}
				</div>
			)}
		</div>
	);
}