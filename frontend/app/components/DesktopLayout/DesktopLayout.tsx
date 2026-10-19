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
		// On phones (`compact`) the desktop becomes one icon grid (Sidebar and FloatingIcons
		// render as `contents`) and the open window is laid over it, maximized.
		<div className="relative isolate flex h-dvh w-screen overflow-hidden compact:grid compact:grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] compact:content-start compact:justify-items-center compact:gap-x-1 compact:gap-y-3 compact:px-xp-sm compact:pt-xp-lg compact:pb-12">
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

			<main className="flex min-w-0 flex-1 items-start overflow-auto p-10 max-lg:p-xp-xl compact:pointer-events-none compact:absolute compact:inset-x-0 compact:top-0 compact:bottom-10 compact:justify-center compact:p-xp-sm compact:*:pointer-events-auto compact:*:w-[max(90vw,304px)]">
				{children}
			</main>

			<FloatingIcons />
			<Taskbar />
		</div>
	);
}