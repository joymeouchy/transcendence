"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { tokenStorage } from "@/lib/token";

export default function AuthCallbackContent() {
	const router = useRouter();
	const searchParams = useSearchParams();

	useEffect(() => {
		const token = searchParams.get("token");

		if (!token) {
			router.replace("/login");
			return;
		}

		tokenStorage.set(token);

		// Picked up by AuthContext after the reload to play the login sound
		sessionStorage.setItem("pendingLoginSound", "1");

		window.location.replace("/home");
	}, [router, searchParams]);

	return <div>Signing you in...</div>;
}
