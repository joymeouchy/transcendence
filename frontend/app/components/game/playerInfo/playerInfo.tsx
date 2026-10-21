"use client";

import clsx from "clsx";
import "./playerInfo.scss";

import { images } from "@/lib/images";
import ActivePowerUp from "../PowerUps/ActivePowerUp";


type Props = {
	username: string;
	avatar?: string | null;
	side: "left" | "right";
	effect: {
		type: string;
		expiresAt: number;
	} | null;
};

// Beside the canvas on wide screens; above (left player) / below (right
// player) it on narrower ones (`game-stacked`, see tailwind.css).
const sideClass = {
	left: "-left-32.5 game-stacked:-top-10 game-stacked:right-auto game-stacked:bottom-auto game-stacked:left-0 game-stacked:flex-row",
	right: "-right-32.5 game-stacked:top-auto game-stacked:-bottom-22.5 game-stacked:left-auto game-stacked:right-0 game-stacked:flex-row-reverse",
};

// Every text span in the HUD (name and power-up labels) shares this.
export const hudTextClass =
	"player-hud-text min-h-5.5 max-w-30 truncate game-stacked:min-h-auto game-stacked:max-w-25";

export default function PlayerInfo({
	username,
	avatar,
	side,
	effect,
}: Props) {

	return (
		<div
			className={clsx(
				// max-w-30 keeps the HUD inside the 32.5 gutter so long power-up
				// names wrap instead of spilling over the canvas
				"absolute top-1/2 z-2 flex min-w-30 max-w-30 -translate-y-1/2 flex-col items-center gap-2.5 font-[monospace] text-xp-2xl text-xp-white",
				"game-stacked:w-auto game-stacked:min-w-0 game-stacked:max-w-none game-stacked:items-center game-stacked:gap-2 max-[900px]:min-w-auto",
				sideClass[side],
			)}
		>

			<img
				src={avatar || images.defaultUserIcon}
				alt="player avatar"
				className="player-avatar size-17.5 shrink-0 rounded-xp-sm border-3 border-xp-white object-cover game-stacked:size-12.5"
			/>

			<span className={hudTextClass}>{username}</span>

			<ActivePowerUp
				effect={effect}
				className={clsx(
					"min-h-9 text-center text-xp-lg game-stacked:static game-stacked:m-0 game-stacked:min-h-auto game-stacked:text-xp-base",
					side === "left" ? "game-stacked:text-left" : "game-stacked:text-right",
				)}
				textClassName={hudTextClass}
			/>
		</div>
	);
}
