"use client";

import { useState } from "react";
import XPModal from "../ui/XPModal/XPModal";
import {
	desktopThemes,
	DesktopTheme,
} from "./desktopCustomization";
import "./DesktopCustomizationModal.scss";

type Props = {
	isOpen: boolean;
	onClose: () => void;
};

export default function DesktopCustomizationModal({
	isOpen,
	onClose,
}: Props) {
	const [selectedTheme, setSelectedTheme] =
		useState<DesktopTheme>(desktopThemes[0]);

	const handleSave = () => {
		console.log("Selected theme:", selectedTheme);

		// We'll apply the theme here later
		onClose();
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
							className={`theme-card ${
								selectedTheme.id === theme.id
									? "selected"
									: ""
							}`}
							onClick={() => setSelectedTheme(theme)}
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
					<button onClick={handleSave}>
						Save
					</button>

					<button onClick={onClose}>
						Cancel
					</button>
				</div>
			</div>
		</XPModal>
	);
}