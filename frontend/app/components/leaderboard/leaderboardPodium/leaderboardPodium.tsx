"use client";

import styles from "./leaderboardPodium.module.scss";

export type LeaderboardPlayer = {
	id: number;
	username: string;
	avatarUrl?: string | null;
	wins: number;
	losses: number;
	winRate: number;
};

type LeaderboardPodiumProps = {
	players: LeaderboardPlayer[];
};

export default function LeaderboardPodium({
	players,
}: LeaderboardPodiumProps) {

	const first = players[0];
	const second = players[1];
	const third = players[2];

	return (
		<div className={styles.podiumContainer}>
			<div className={styles.title}>
				Top Players
			</div>

			<div className={styles.podium}>
				{second && (
					<PodiumPlayer
						player={second}
						rank={2}
					/>
				)}

				{first && (
					<PodiumPlayer
						player={first}
						rank={1}
					/>
				)}

				{third && (
					<PodiumPlayer
						player={third}
						rank={3}
					/>
				)}
			</div>
		</div>
	);
}

function PodiumPlayer({
	player,
	rank,
}: {
	player: LeaderboardPlayer;
	rank: 1 | 2 | 3;
}) {
	return (
		<div
			className={`${styles.player} ${rank === 1
					? styles.first
					: rank === 2
						? styles.second
						: styles.third
				}`}
		>
			<div className={styles.medal}>
				{rank === 1
					? "🥇"
					: rank === 2
						? "🥈"
						: "🥉"}
			</div>

			{player.avatarUrl ? (
				<img
					src={player.avatarUrl}
					alt={`${player.username}'s avatar`}
					className={styles.avatar}
				/>
			) : (
				<div className={styles.avatarFallback}>
					{player.username
						.charAt(0)
						.toUpperCase()}
				</div>
			)}

			<div className={styles.username}>
				{player.username}
			</div>

			<div className={styles.winRate}>
				{player.winRate}%
			</div>

			<div className={styles.record}>
				{player.wins}W / {player.losses}L
			</div>

			<div className={styles.base}>
				{rank}
			</div>
		</div>
	);
}
