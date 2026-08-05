"use client";

import "./playerInfo.scss";

import { images } from "@/lib/images";
import ActivePowerUp from "../PowerUps/PowerUpExpiration";


type Props = {
	username: string;
	avatar?: string | null;
	side: "left" | "right";
	effect: {
		type: string;
		expiresAt: number;
	} | null;
};


export default function PlayerInfo({
	username,
	avatar,
	side,
	effect,
}: Props) {

	return (
		<div className={`player-info ${side}`}>

			<img src={avatar || images.defaultUserIcon} alt="player avatar" />

			<span>{username}</span>

			<ActivePowerUp effect={effect} />
		</div>
	);
}