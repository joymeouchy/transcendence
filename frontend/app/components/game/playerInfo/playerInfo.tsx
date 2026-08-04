"use client";

import "./playerInfo.scss";


type Props = {
	username: string;
	avatar?: string;
	side: "left" | "right";
};


export default function PlayerInfo({
	username,
	avatar,
	side,
}: Props) {

	return (
		<div className={`player-info ${side}`}>

			<img
				src={
					avatar ??
					"/default-avatar.png"
				}
				alt="player avatar"
			/>

			<span>
				{username}
			</span>

		</div>
	);
}