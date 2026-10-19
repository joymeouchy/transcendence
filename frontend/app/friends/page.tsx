"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useAlert } from "@/context/AlertContext";

import {
	FriendshipService,
	Friend,
	PendingRequest,
} from "@/services/friendships.service";

import FriendsPageTemplate from "../components/Friends/FriendsPageTemplate/FriendsPageTemplate";

export default function FriendsPage() {
	const router = useRouter();
	const { user, onlineUsers } = useAuth();
	const { showAlert } = useAlert();

	const [friends, setFriends] = useState<Friend[]>([]);
	const [requests, setRequests] = useState<PendingRequest[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!user) return;

		const userId = user.id;

		async function loadPage() {
			try {
				const [friendsData, requestsData] =
					await Promise.all([
						FriendshipService.getFriends(userId),
						FriendshipService.getPendingRequests(
							userId
						),
					]);

				setFriends(friendsData);
				setRequests(requestsData);
			} catch (error) {
			} finally {
				setLoading(false);
			}
		}

		loadPage();
	}, [user]);

	const refreshFriends = useCallback(async () => {
		if (!user) return;

		try {
			const [friendsData, requestsData] =
				await Promise.all([
					FriendshipService.getFriends(user.id),
					FriendshipService.getPendingRequests(
						user.id
					),
				]);

			setFriends(friendsData);
			setRequests(requestsData);
		} catch {
		}
	}, [user]);

	// another tab (or the other user) may have changed things meanwhile:
	// reload when this tab comes back into view
	useEffect(() => {
		const handleVisible = () => {
			if (document.visibilityState === "visible") {
				refreshFriends();
			}
		};

		document.addEventListener("visibilitychange", handleVisible);
		window.addEventListener("focus", handleVisible);

		return () => {
			document.removeEventListener("visibilitychange", handleVisible);
			window.removeEventListener("focus", handleVisible);
		};
	}, [refreshFriends]);

	// On failure (e.g. the request was already accepted/rejected in another
	// tab) the api popup explains why; reloading shows the real state.
	async function handleAccept(id: number) {
		try {
			await FriendshipService.acceptRequest(id);
		} catch {
		}

		await refreshFriends();
	}

	async function handleReject(id: number) {
		if (!user) return;

		try {
			// Reject and remove share one endpoint that deletes the friendship
			// whatever its status. If this tab is stale and the request was
			// accepted elsewhere, rejecting would silently unfriend: check first.
			const pending = await FriendshipService.getPendingRequests(user.id);

			if (!pending.some((request) => request.id === id)) {
				showAlert("This friend request was already answered.");
				await refreshFriends();
				return;
			}

			await FriendshipService.rejectRequest(id);

			setRequests((prev) =>
				prev.filter(
					(request) => request.id !== id
				)
			);
		} catch {
			await refreshFriends();
		}
	}

	async function handleRemoveFriend(
		friendshipId: number
	) {
		try {
			await FriendshipService.removeFriend(
				friendshipId
			);

			setFriends((prev) =>
				prev.filter(
					(friend) =>
						friend.friendshipId !== friendshipId
				)
			);
		} catch {
			await refreshFriends();
		}
	}

	async function handleAddFriend(
		receiverId: number
	) {
		if (!user) return;

		// errors propagate: AddFriendPanel only reports success when this resolves
		// (the failure itself is already shown by the api error popup)
		await FriendshipService.sendRequest(
			user.id,
			receiverId
		);

		await refreshFriends();
	}

	const liveFriends = friends.map((friend) => ({
		...friend,
		isOnline:
			onlineUsers[friend.id] ?? friend.isOnline,
	}));

	return (
		<FriendsPageTemplate
			friends={liveFriends}
			requests={requests}
			loading={loading}
			onAccept={handleAccept}
			onReject={handleReject}
			onRemoveFriend={handleRemoveFriend}
			onSelectFriend={(friend) =>
				router.push(`/profile/${friend.id}`)
			}
			onAddFriend={handleAddFriend}
			onClose={() =>
				router.push("/home")
			}
		/>
	);
}