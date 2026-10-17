"use client";

import clsx from "clsx";
import styles from "./myStats.module.scss";
import XPCard from "../../ui/XPCard/XPCard";

import { LeaderboardPlayer } from "@/services/user.services";


type MyStatsProps = {
	players: LeaderboardPlayer[];
	currentUserId?: number;
};

const cardProps = {
	title: "My Stats",
	className: "max-[480px]:p-xp-xs",
	titleClassName: "max-[480px]:px-1.5 max-[480px]:py-1",
};

export default function MyStats({
	players,
	currentUserId,
}: MyStatsProps) {
	const currentUser = players.find(
		(player) => player.id === currentUserId
	);

	if (!currentUser) {
		return (
			<XPCard {...cardProps}>
				<div className="px-1.25 py-3.75 text-center text-xp-sm opacity-70">
					No stats available
				</div>
			</XPCard>
		);
	}

	const rank = currentUser.rank;

	return (
		<XPCard {...cardProps}>
			<div
				className={clsx(
					styles.rankSection,
					"flex items-center justify-between rounded-xp-sm border border-xp-steel bg-xp-white px-1.75 py-1.25",
				)}
			>
				<span className="text-xp-xs">
					Rank
				</span>

				<strong className="text-xp-xl text-xp-blue">
					#{rank}
				</strong>
			</div>

			<div className="my-2.25 text-center text-[25px] font-bold text-xp-blue max-[480px]:text-xp-4xl">
				{currentUser.winRate}%
				<span className="mt-px block text-xp-xs font-normal opacity-70"> Win Rate</span>
			</div>
		</XPCard>
	);
}
