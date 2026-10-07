"use client";

import styles from "./myStats.module.scss";

import { LeaderboardPlayer } from "@/services/user.services";


type MyStatsProps = {
	players: LeaderboardPlayer[];
	currentUserId?: number;
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
			<div className={styles.container}>
				<div className={styles.title}>
					My Stats
				</div>

				<div className={styles.empty}>
					No stats available
				</div>
			</div>
		);
	}

	const rank = currentUser.rank;

	return (
		<div className={styles.container}>
			<div className={styles.title}>
				My Stats
			</div>

			<div className={styles.rankSection}>
				<span className={styles.rankLabel}>
					Rank
				</span>

				<strong className={styles.rank}>
					#{rank}
				</strong>
			</div>

			<div className={styles.winRate}>
				{currentUser.winRate}%
				<span> Win Rate</span>
			</div>
		</div>
	);
}