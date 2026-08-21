"use client";

import { useEffect, useState } from "react";

import XPModal from "../../../ui/XPModal/XPModal";
import { useAuth } from "@/context/AuthContext";
import {
	Friend,
	FriendshipService,
} from "@/services/friendships.service";

import "./FriendSelectModal.scss";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	onSelectFriend: (friend: Friend) => void;
};

export default function FriendSelectModal({
	isOpen,
	onClose,
	onSelectFriend,
}: Props) {
	const { user } = useAuth();

	const [friends, setFriends] = useState<Friend[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!isOpen || !user?.id) return;

		const loadFriends = async () => {
			setLoading(true);

			try {
				const data = await FriendshipService.getFriends(
					user.id
				);

				setFriends(data);
			} catch (error) {
				console.error(
					"Failed to load friends:",
					error
				);
				setFriends([]);
			} finally {
				setLoading(false);
			}
		};

		loadFriends();
	}, [isOpen, user?.id]);

	return (
		<XPModal
			title="Play with a Friend"
			isOpen={isOpen}
			onClose={onClose}
		>
			<div className="friend-select">
				<div className="friend-select__header">
					<p>Choose a friend</p>
					<span>
						Select an online friend to play against.
					</span>
				</div>

				<div className="friend-list">
					{loading ? (
						<p className="friend-list__empty">
							Loading friends...
						</p>
					) : friends.length === 0 ? (
						<p className="friend-list__empty">
							You don't have any friends yet.
						</p>
					) : (
						[...friends]
							.sort((a, b) => Number(b.isOnline) - Number(a.isOnline))
							.map((friend) => (
								<div
									key={friend.id}
									className="friend-item"
								>
									<div className="friend-item__info">

										<div className="friend-item__details">
											<span className="friend-item__name">
												{friend.username}
											</span>

											<span className="friend-item__status">
												<span
													className={
														friend.isOnline
															? "🟢 Online"
															: "⚫ Offline"
													}
												/>
												{friend.isOnline
													? "🟢 Online"
													: "⚫ Offline"}
											</span>
										</div>
									</div>

									<button
										disabled={!friend.isOnline}
										onClick={() =>
											onSelectFriend(friend)
										}
									>
										Play
									</button>
								</div>
							))
					)}
				</div>

				<div className="friend-select__buttons">
					<button onClick={onClose}>
						Back
					</button>
				</div>
			</div>
		</XPModal>
	);
}