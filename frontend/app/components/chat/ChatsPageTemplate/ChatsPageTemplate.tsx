"use client";

import { useEffect, useRef, useState } from "react";

import DesktopLayout from "../../DesktopLayout/DesktopLayout";
import XPWindow from "../../ui/XPWindow/XPWindow";

import FriendsListPanel from "../../Friends/FriendListPanel/FriendListPanel";
import ChatPanel from "../../chat/ChatPanel/ChatPanel";

import { Friend, UserProfile } from "@/types/types.dto";

import styles from "./ChatsPageTemplate.module.scss";
import { Message } from "@/types/messages";
import { MessagesService } from "@/services/messages.services";
import useMessageSocket from "../UseMessagesSocket";

interface Props {
	user?: UserProfile;
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

	const [messages, setMessages] = useState<Message[]>([]);
	const [messagesLoading, setMessagesLoading] =
		useState(false);
	const [unreadCounts, setUnreadCounts] =
		useState<Record<number, number>>({});
	const { receivedMessage } = useMessageSocket();
	const lastProcessedMessageId = useRef<number | null>(null);

	useEffect(() => {
		if (
			!selectedFriend &&
			friends.length > 0
		) {
			setSelectedFriend(friends[0]);
		}
	}, [friends, selectedFriend]);
	useEffect(() => {
		if (!selectedFriend) return;

		const friendId = selectedFriend.id;

		async function loadMessages() {
			setMessagesLoading(true);

			try {
				const messagesData =
					await MessagesService.getMessages(
						friendId
					);

				setMessages(messagesData);
			} catch (error) {
				console.error(
					"Failed to load messages:",
					error
				);
				setMessages([]);
			} finally {
				setMessagesLoading(false);
			}
		}

		loadMessages();
	}, [selectedFriend]);

	
useEffect(() => {
    if (!receivedMessage) return;

    // Ignore messages we've already processed
    if (lastProcessedMessageId.current === receivedMessage.id) {
        return;
    }

    lastProcessedMessageId.current = receivedMessage.id;

    // Ignore messages sent by the current user
    if (receivedMessage.senderId === user?.id) {
        return;
    }

    // Message belongs to the currently open chat
    if (selectedFriend?.id === receivedMessage.senderId) {
        setMessages((prev) => {
            // Prevent duplicate messages in the chat
            if (prev.some((message) => message.id === receivedMessage.id)) {
                return prev;
            }

            return [...prev, receivedMessage];
        });

        return;
    }

    // Message belongs to another chat
    setUnreadCounts((prev) => ({
        ...prev,
        [receivedMessage.senderId]:
            (prev[receivedMessage.senderId] || 0) + 1,
    }));
}, [receivedMessage, selectedFriend?.id, user?.id]);

	function handleSelectFriend(friend: Friend) {
		setSelectedFriend(friend);

		setUnreadCounts((prev) => {
			const updated = { ...prev };
			delete updated[friend.id];
			return updated;
		});
	}

	if (loading) {
		return (
			<DesktopLayout>
				<XPWindow
					title="MSN"
					onClose={onClose}
				>
					<div className={styles.loading}>
						Loading chats...
					</div>
				</XPWindow>
			</DesktopLayout>
		);
	}
	async function handleSendMessage(content: string) {
		if (!user) return;
		if (!selectedFriend) return;

		const tempMessage: Message = {
			id: Date.now(),
			senderId: user.id,
			receiverId: selectedFriend.id,
			content,
			createdAt: new Date().toISOString(),
		};
		setMessages((prev) => [
			...prev,
			tempMessage,
		]);

		try {
			await MessagesService.sendMessage(
				selectedFriend.id,
				content
			);
		} catch (error) {
			console.error(
				"Failed to send message:",
				error
			);

			setMessages((prev) =>
				prev.filter(
					(message) =>
						message.id !== tempMessage.id
				)
			);
		}
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
								handleSelectFriend
							}
							unreadCounts={unreadCounts}
						/>
					</div>

					<div className={styles.chatPanel}>
						{selectedFriend ? (
							<ChatPanel
								user={selectedFriend}
								currentUserId={user?.id ?? 0}
								messages={messages}
								messagesLoading={messagesLoading}
								onSendMessage={handleSendMessage}
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