"use client";

import { ReactNode } from "react";

import Sidebar from "@/app/components/Sidebar/Sidebar";
import Taskbar from "@/app/components/Taskbar/Taskbar";
import FloatingIcons from "../FloatingIcons/FloatingIcons";

import { useAuth } from "@/context/AuthContext";
import { desktopThemes } from "../DesktopCustomizationModal/desktopCustomization";
import { images } from "@/lib/images";

import clsx from "clsx";
import "./DesktopLayout.scss";

type DesktopLayoutProps = {
	children: ReactNode;
};

export default function DesktopLayout({
	children,
}: DesktopLayoutProps) {
	const { user, loading } = useAuth();

	const selectedTheme = desktopThemes.find(
		(theme) => theme.id === user?.preferredWallpaper
	);

	const wallpaper =
		selectedTheme?.background ??
		images.windowsDefaultWallpaper;

	return (
		<div className="relative isolate flex h-screen w-screen overflow-hidden">
			<div
				className={clsx(
					"xp-desktop-wallpaper pointer-events-none absolute -inset-3.5 -z-1 bg-cover bg-center bg-no-repeat",
					loading && "is-loading",
				)}
				style={{
					backgroundImage: `url(${wallpaper})`,
				}}
			/>

			<Sidebar />

			<main className="flex min-w-0 flex-1 items-start overflow-auto p-10">
				{children}
			</main>

			<FloatingIcons />
			<Taskbar />
		</div>
	);
}