"use client";

import { useEffect, useState } from "react";

import XPModal from "../../../ui/XPModal/XPModal";
import { useAuth } from "@/context/AuthContext";
import {
	Friend,
	FriendshipService,
} from "@/services/friendships.service";


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
			<div className="flex min-w-105 flex-col gap-4 p-5">
				<div className="flex flex-col gap-1">
					<p className="m-0 text-xp-xl font-bold">Choose a friend</p>
					<span className="text-xp-md text-xp-gray-700">
						Select an online friend to play against.
					</span>
				</div>

				<div className="flex max-h-75 flex-col gap-2 overflow-y-auto p-1">
					{loading ? (
						<p className="my-5 text-center text-xp-md text-xp-gray-600">
							Loading friends...
						</p>
					) : friends.length === 0 ? (
						<p className="my-5 text-center text-xp-md text-xp-gray-600">
							You don't have any friends yet.
						</p>
					) : (
						[...friends]
							.sort((a, b) => Number(b.isOnline) - Number(a.isOnline))
							.map((friend) => (
								<div
									key={friend.id}
									className="flex items-center justify-between border border-xp-gray-300 bg-xp-gray-50 px-2.5 py-2"
								>
									<div className="flex min-w-0 items-center">

										<div className="flex flex-col gap-0.5">
											<span className="text-xp-lg font-bold">
												{friend.username}
											</span>

											<span className="text-xp-sm text-xp-gray-700">
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
										className="ml-5 min-w-15 cursor-pointer px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
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

				<div className="mt-1 flex justify-end">
					<button className="min-w-17.5 cursor-pointer px-4 py-1" onClick={onClose}>
						Back
					</button>
				</div>
			</div>
		</XPModal>
	);
}