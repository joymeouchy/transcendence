"use client";

import { useRouter } from "next/navigation";

import ProfilePageTemplate from "../components/Profile/ProfilePageTemplate/ProfilePageTemplate";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
	const router = useRouter();

	const { user } = useAuth();

	return (
		<ProfilePageTemplate
			user={user ?? undefined}
			isOwnProfile={true}
			onClose={() =>
				router.push("/home")
			}
		/>
	);
}