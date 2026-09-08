"use client";

import { useEffect, useState } from "react";

import DesktopLayout from "../../DesktopLayout/DesktopLayout";
import XPWindow from "../../ui/XPWindow/XPWindow";

import FriendsListPanel from "../../Friends/FriendListPanel/FriendListPanel";
import ChatPanel from "../../chat/ChatPanel/ChatPanel";

import { Friend, UserProfile } from "@/types/types.dto";

import styles from "./ChatsPageTemplate.module.scss";
import {
	Message,
} from "../MessageList/MessageList";

interface Props {
	user: UserProfile;
	friends: Friend[];

	loading?: boolean;

	onClose?: () => void;
}

export default function ChatsPageTemplate({
	user,
	friends,
	loading = false,
	onClose,
}: Props) {
	const [selectedFriend, setSelectedFriend] =
		useState<Friend | null>(null);

	const messages: Message[] = [
	{
		id: 1,
		senderId: 20,
		content: "Hey! 👋",
		createdAt: "2026-08-22T20:30:00",
	},
	{
		id: 2,
		senderId: user.id,
		content: "Hey! What's up?",
		createdAt: "2026-08-22T20:31:00",
	},
	{
		id: 3,
		senderId: 20,
		content: "Wanna play some Pong?",
		createdAt: "2026-08-22T20:32:00",
	},
	{
		id: 4,
		senderId: user.id,
		content: "Sure 😂 I'm ready.",
		createdAt: "2026-08-22T20:33:00",
	},
		{
		id: 5,
		senderId: user.id,
		content: "Sure 😂 I'm ready.",
		createdAt: "2026-08-22T20:33:00",
	},
		{
		id: 6,
		senderId: user.id,
		content: "Sure 😂 I'm ready.",
		createdAt: "2026-08-22T20:33:00",
	},
		{
		id: 7,
		senderId: user.id,
		content: "Sure 😂 I'm ready.",
		createdAt: "2026-08-22T20:33:00",
	},
		{
		id: 8,
		senderId: user.id,
		content: "Sure 😂 I'm ready.",
		createdAt: "2026-08-22T20:33:00",
	},
];

	useEffect(() => {
		if (
			!selectedFriend &&
			friends.length > 0
		) {
			setSelectedFriend(friends[0]);
		}
	}, [friends, selectedFriend]);

	if (loading) {
		return (
			<DesktopLayout>
				<XPWindow
					title="MSN"
					onClose={onClose}
				>
					<div className={styles.loading}>
						Loading friends list...
					</div>
				</XPWindow>
			</DesktopLayout>
		);
	}

	return (
		<DesktopLayout>
			<XPWindow
				title="MSN"
				onClose={onClose}
			>
				<div className={styles.page}>
					<div className={styles.friendsPanel}>
						<FriendsListPanel
							friends={friends}
							selectedFriendId={
								selectedFriend?.id
							}
							onSelectFriend={
								setSelectedFriend
							}
						/>
					</div>

					<div className={styles.chatPanel}>
						{selectedFriend ? (
							<ChatPanel
								user={selectedFriend}
								currentUserId={user.id}
								messages={messages}
							/>
						) : (
							<div className={styles.empty}>
								Select a friend to start
								chatting
							</div>
						)}
					</div>
				</div>
			</XPWindow>
		</DesktopLayout>
	);
}