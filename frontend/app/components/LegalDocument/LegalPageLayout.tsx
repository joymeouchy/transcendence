"use client";

import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import DesktopLayout from "../DesktopLayout/DesktopLayout";
import AuthLayout from "../auth/AuthLayout";
import XPWindow from "../ui/XPWindow/XPWindow";

type LegalPageLayoutProps = {
	title: string;
	children: React.ReactNode;
};

// The legal pages are public: signed-in users read them on the desktop,
// guests (coming from the welcome screen footer) on the welcome screen.
export default function LegalPageLayout({ title, children }: LegalPageLayoutProps) {
	const router = useRouter();
	const { user, loading } = useAuth();

	// wait for the session check so a signed-in user never sees the guest screen flash
	if (loading) return null;

	const legalWindow = (
		<XPWindow
			title={title}
			onClose={() => router.push(user ? "/home" : "/")}
		>
			{children}
		</XPWindow>
	);

	if (user) return <DesktopLayout>{legalWindow}</DesktopLayout>;

	return <AuthLayout fullWidth>{legalWindow}</AuthLayout>;
}
