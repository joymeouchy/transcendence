"use client";

import { ReactNode } from "react";

import Sidebar from "@/app/components/Sidebar/Sidebar";
import Taskbar from "@/app/components/Taskbar/Taskbar";
import FloatingIcons from "../FloatingIcons/FloatingIcons";

import { useAuth } from "@/context/AuthContext";
import { desktopThemes } from "../DesktopCustomizationModal/desktopCustomization";
import { images } from "@/lib/images";

import "./DesktopLayout.scss";

type DesktopLayoutProps = {
	children: ReactNode;
};

export default function DesktopLayout({
	children,
}: DesktopLayoutProps) {
	const { user } = useAuth();

	const selectedTheme = desktopThemes.find(
		(theme) => theme.id === user?.preferredWallpaper
	);

	const wallpaper =
		selectedTheme?.background ??
		images.windowsDefaultWallpaper;

	return (
		<div
			className="xp-desktop"
			style={{
				backgroundImage: `url(${wallpaper})`,
			}}
		>
			<Sidebar />

			<main className="xp-desktop-content">
				{children}
			</main>

			<FloatingIcons />
			<Taskbar />
		</div>
	);
}