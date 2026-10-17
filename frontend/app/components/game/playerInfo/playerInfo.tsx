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
// player) it from 1100px down.
const sideClass = {
	left: "-left-32.5 max-[1100px]:-top-10 max-[1100px]:right-auto max-[1100px]:bottom-auto max-[1100px]:left-0 max-[1100px]:flex-row",
	right: "-right-32.5 max-[1100px]:top-auto max-[1100px]:-bottom-22.5 max-[1100px]:left-auto max-[1100px]:right-0 max-[1100px]:flex-row-reverse",
};

// Every text span in the HUD (name and power-up labels) shares this.
export const hudTextClass =
	"player-hud-text min-h-5.5 max-w-30 truncate max-[1100px]:min-h-auto max-[1100px]:max-w-25";

export default function PlayerInfo({
	username,
	avatar,
	side,
	effect,
}: Props) {

	return (
		<div
			className={clsx(
				"absolute top-1/2 z-2 flex min-w-30 -translate-y-1/2 flex-col items-center gap-2.5 font-[monospace] text-xp-2xl text-xp-white",
				"max-[1100px]:w-auto max-[1100px]:min-w-0 max-[1100px]:items-center max-[1100px]:gap-2 max-[900px]:min-w-auto",
				sideClass[side],
			)}
		>

			<img
				src={avatar || images.defaultUserIcon}
				alt="player avatar"
				className="player-avatar size-17.5 shrink-0 rounded-xp-sm border-3 border-xp-white object-cover max-[1100px]:size-12.5"
			/>

			<span className={hudTextClass}>{username}</span>

			<ActivePowerUp
				effect={effect}
				className={clsx(
					"min-h-9 text-center text-xp-lg max-[1100px]:static max-[1100px]:m-0 max-[1100px]:min-h-auto max-[1100px]:text-xp-base",
					side === "left" ? "max-[1100px]:text-left" : "max-[1100px]:text-right",
				)}
				textClassName={hudTextClass}
			/>
		</div>
	);
}
