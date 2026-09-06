"use client";

import { useState } from "react";

import XPModal from "../ui/XPModal/XPModal";
import {
	desktopThemes,
	DesktopTheme,
} from "./desktopCustomization";
import { customizationService } from "@/services/Customization.services";
import { useAuth } from "@/context/AuthContext";

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
			console.error("Failed to update wallpaper:", error);
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
			<div className="customization">
				<div className="theme-list">
					{desktopThemes.map((theme) => (
						<button
							key={theme.id}
							className={`theme-card ${selectedTheme.id === theme.id
									? "selected"
									: ""
								}`}
							onClick={() => setSelectedTheme(theme)}
							disabled={isSaving}
						>
							<div className="theme-preview">
								<img
									src={theme.background}
									alt={theme.name}
									className="preview-background"
								/>
							</div>

							<span>{theme.name}</span>
						</button>
					))}
				</div>

				<div className="customization_actions">
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