"use client";

import { useState } from "react";
import "./FloatingIcons.scss";
import FloatingIcon from "./floatingIcon/floatingIcon";
import { floatingIcons } from "@/app/data/navigationItems/FloatingIconsFields";
import DeepThoughtModal from "../deepThoughtModal/deepThoughtModal";
import MarvinModal from "../marvinModal/marvinModal";

export default function FloatingIcons() {
	const [deepThoughtOpen, setDeepThoughtOpen] = useState(false);
	const [marvinOpen, setMarvinOpen] = useState(false);

	return (
		<>
			<div className="floating-icons">
				{floatingIcons.map((icon) => (
					<div
						key={icon.label}
						className={`floating-icon-position ${icon.position}`}
					>
						<FloatingIcon
							image={icon.image}
							label={icon.label}
							onClick={() => {
								if (icon.label === "Deep Thought") {
									setDeepThoughtOpen(true);
								}

								if (icon.label === "Marvin") {
									setMarvinOpen(true);
								}
							}}
						/>
					</div>
				))}
			</div>

			<DeepThoughtModal
				isOpen={deepThoughtOpen}
				onClose={() => setDeepThoughtOpen(false)}
			/>
			<MarvinModal
				isOpen={marvinOpen}
				onClose={() => setMarvinOpen(false)}
			/>
		</>
	);
}