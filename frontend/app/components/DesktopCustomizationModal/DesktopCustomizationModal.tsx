"use client";

import { useState } from "react";

import XPModal from "../ui/XPModal/XPModal";
import {
	desktopThemes,
	DesktopTheme,
} from "./desktopCustomization";
import { customizationService } from "@/services/Customization.services";
import { useAuth } from "@/context/AuthContext";

import clsx from "clsx";
import "./DesktopCustomizationModal.scss";

type Props = {
	isOpen: boolean;
	onClose: () => void;
};

export default function DesktopCustomizationModal({
	isOpen,
	onClose,
}: Props) {
	const { refreshUser } = useAuth();

	const [selectedTheme, setSelectedTheme] =
		useState<DesktopTheme>(desktopThemes[0]);

	const [isSaving, setIsSaving] = useState(false);

	const handleSave = async () => {
		try {
			setIsSaving(true);

			await customizationService.updateWallpaper(
				selectedTheme.id
			);

			await refreshUser();

			onClose();
		} catch (error) {
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<XPModal
			title="Customize"
			isOpen={isOpen}
			onClose={onClose}
		>
			<div className="flex h-150 max-h-[70vh] min-h-0 flex-col">
				<div className="grid min-h-0 flex-1 grid-cols-2 gap-4 overflow-x-hidden overflow-y-auto pt-1 pr-2 pb-2 pl-1">
					{desktopThemes.map((theme) => (
						<button
							key={theme.id}
							className={clsx(
								"desktop-theme-card flex cursor-pointer flex-col items-center gap-2 rounded-xp-lg bg-transparent p-2 text-xp-black",
								selectedTheme.id === theme.id && "selected",
							)}
							onClick={() => setSelectedTheme(theme)}
							disabled={isSaving}
						>
							<div className="relative h-32.5 w-55 overflow-hidden rounded-xp-md bg-xp-black">
								<img
									src={theme.background}
									alt={theme.name}
									className="absolute inset-0 size-full object-cover"
								/>
							</div>

							<span className="font-bold text-xp-black">{theme.name}</span>
						</button>
					))}
				</div>

				<div className="desktop-customization-actions mt-2 flex shrink-0 justify-end gap-2.5 pt-4">
					<button
						onClick={handleSave}
						disabled={isSaving}
					>
						{isSaving ? "Saving..." : "Save"}
					</button>

					<button
						onClick={onClose}
						disabled={isSaving}
					>
						Cancel
					</button>
				</div>
			</div>
		</XPModal>
	);
}