"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import {
	Friend,
	FriendshipService,
} from "@/services/friendships.service";

import ChatsPageTemplate from "../components/chat/ChatsPageTemplate/ChatsPageTemplate";

export default function ChatsPage() {
	const router = useRouter();
	const { user } = useAuth();

	const [friends, setFriends] = useState<Friend[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!user) return;

		const userId = user.id;

		async function loadFriends() {
			try {
				const friendsData =
					await FriendshipService.getFriends(
						userId
					);

				setFriends(friendsData);
			} catch (error) {
				console.error(
					"Failed to load friends:",
					error
				);
			} finally {
				setLoading(false);
			}
		}

		loadFriends();
	}, [user]);


	return (
		<ChatsPageTemplate
			user={user ?? undefined}
			friends={friends}
			loading={loading}
			onClose={() =>
				router.push("/home")
			}
		/>
	);
}