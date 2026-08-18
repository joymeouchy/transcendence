"use client";

import DesktopLayout from "../../DesktopLayout/DesktopLayout";
import XPWindow from "../../ui/XPWindow/XPWindow";

import AddFriendPanel from "../AddFriendsPanel/AddFriendsPanel";
import FriendRequestsPanel from "../FriendRequestPanel/FriendRequestPanel";
import FriendsListPanel from "../FriendListPanel/FriendListPanel";

import { FriendRequest, Friend } from "@/types/types.dto";

import styles from "./FriendsPageTemplate.module.scss";

interface Props {
	friends: Friend[];
	requests: FriendRequest[];

	loading?: boolean;

	onAccept?: (id: number) => Promise<void>;
	onReject?: (id: number) => Promise<void>;
	onRemoveFriend?: (
		id: number
	) => Promise<void>;

	onAddFriend?: (
		receiverId: number
	) => Promise<void>;

	onClose?: () => void;
}

export default function FriendsPageTemplate({
	friends,
	requests,
	loading = false,
	onAccept,
	onReject,
	onRemoveFriend,
	onAddFriend,
	onClose,
}: Props) {
	if (loading) {
		return (
			<DesktopLayout>
				<XPWindow
					title="Friends"
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
				title="Friends"
				onClose={onClose}
			>
				<div className={styles.page}>
					<div className={styles.leftColumn}>
						<AddFriendPanel
							onAddFriend={onAddFriend}
						/>

						<FriendRequestsPanel
							requests={requests}
							onAccept={onAccept}
							onReject={onReject}
						/>
					</div>

					<div className={styles.friendsPanel}>
						<FriendsListPanel
							friends={friends}
							onRemoveFriend={onRemoveFriend}
						/>
					</div>
				</div>
			</XPWindow>
		</DesktopLayout>
	);
}