"use client";

import { useMemo, useState } from "react";
import {
	LeaderboardPlayer,
} from "../leaderboardPodium/leaderboardPodium";

import styles from "./leaderboardTable.module.scss";

type LeaderboardScope = "all" | "friends";

type LeaderboardTableProps = {
	players: LeaderboardPlayer[];
	currentUserId?: number;
};

export default function LeaderboardTable({
	players,
	currentUserId,
}: LeaderboardTableProps) {
	const [scope, setScope] =
		useState<LeaderboardScope>("all");

	const sortedPlayers = useMemo(() => {
		return [...players].sort(
			(a, b) => b.winRate - a.winRate
		);
	}, [players]);

	return (
		<div className={styles.container}>
			<div className={styles.tabs}>
				<button
					className={
						scope === "all"
							? styles.activeTab
							: styles.tab
					}
					onClick={() => setScope("all")}
				>
					All Players
				</button>

				<button
					className={
						scope === "friends"
							? styles.activeTab
							: styles.tab
					}
					onClick={() => setScope("friends")}
				>
					Friends
				</button>
			</div>

			<div className={styles.table}>
				<div className={styles.header}>
					<span className={styles.rank}>
						#
					</span>

					<span className={styles.player}>
						Player
					</span>

					<span>W</span>
					<span>L</span>
					<span>Win Rate</span>
				</div>

				{sortedPlayers.map((player, index) => {
					const rank = index + 1;

					const isCurrentUser =
						player.id === currentUserId;

					return (
						<div
							key={player.id}
							className={`${styles.row} ${
								isCurrentUser
									? styles.currentUser
									: ""
							}`}
						>
							<span className={styles.rank}>
								{rank}
							</span>

							<div className={styles.player}>
								{player.avatarUrl ? (
									<img
										src={
											player.avatarUrl
										}
										alt={`${player.username}'s avatar`}
										className={
											styles.avatar
										}
									/>
								) : (
									<div
										className={
											styles.avatarFallback
										}
									>
										{player.username
											.charAt(0)
											.toUpperCase()}
									</div>
								)}

								<span>
									{player.username}
								</span>
							</div>

							<span>{player.wins}</span>
							<span>{player.losses}</span>

							<strong>
								{player.winRate}%
							</strong>
						</div>
					);
				})}
			</div>
		</div>
	);
}
