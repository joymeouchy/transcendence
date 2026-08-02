"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import ProfilePageTemplate from "@/app/components/Profile/ProfilePageTemplate/ProfilePageTemplate";

import { UserService } from "@/services/user.services";
import {
	Friend,
	FriendshipService,
} from "@/services/friendships.service";

import { useAuth } from "@/context/AuthContext";
import { UserProfile } from "@/types/types.dto";


export default function UserProfilePage() {
	const params = useParams();
	const router = useRouter();

	const { user: currentUser } = useAuth();

	const [user, setUser] =
		useState<UserProfile | null>(null);

	const [friends, setFriends] =
		useState<Friend[]>([]);

	const [loading, setLoading] =
		useState(true);

	const [loadingFriends, setLoadingFriends] =
		useState(true);


	useEffect(() => {
		async function loadProfile() {
			try {
				const id =
					Number(params.id);


				const [profile, friendsData] =
					await Promise.all([
						UserService.getById(id),
						FriendshipService.getFriends(id),
					]);


				setUser(profile);

				setFriends(
					friendsData
				);

			} catch (error) {
				console.error(
					"Failed to load profile:",
					error
				);

			} finally {
				setLoading(false);
				setLoadingFriends(false);
			}
		}


		if (params.id) {
			loadProfile();
		}

	}, [params.id]);


	if (loading) {
		return (
			<ProfilePageTemplate
				friends={[]}
				loadingFriends={true}
			/>
		);
	}


	const isOwnProfile =
		currentUser?.id === user?.id;


	return (
		<ProfilePageTemplate
			user={user ?? undefined}
			friends={friends}
			loadingFriends={loadingFriends}
			isOwnProfile={isOwnProfile}
			onClose={() =>
				router.push("/home")
			}
		/>
	);
}