"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import ProfilePageTemplate from "@/app/components/Profile/ProfilePageTemplate/ProfilePageTemplate";
import { UserService } from "@/services/user.services";
import { useAuth } from "@/context/AuthContext";
import { UserProfile } from "@/types/types.dto";

export default function UserProfilePage() {
	const params = useParams();
	const router = useRouter();

	const { user: currentUser } = useAuth();

	const [user, setUser] =
		useState<UserProfile | null>(null);

	const [loading, setLoading] =
		useState(true);

	useEffect(() => {
		async function loadProfile() {
			try {
				const data =
					await UserService.getById(
						Number(params.id)
					);

				setUser(data);
			} catch (err) {
				console.error(
					"Failed to load profile:",
					err
				);
			} finally {
				setLoading(false);
			}
		}

		if (params.id) {
			loadProfile();
		}
	}, [params.id]);

	if (loading) {
		return (
			<ProfilePageTemplate />
		);
	}

	const isOwnProfile =
		currentUser?.id === user?.id;

	return (
		<ProfilePageTemplate
			user={user ?? undefined}
			isOwnProfile={isOwnProfile}
			onClose={() =>
				router.push("/home")
			}
		/>
	);
}