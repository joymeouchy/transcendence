"use client";

import { useMemo } from "react";

import { LeaderboardPlayer } from "@/services/user.services";

import styles from "./leaderboardTable.module.scss";

type LeaderboardScope = "all" | "friends";

type LeaderboardTableProps = {
	players: LeaderboardPlayer[];
	currentUserId?: number;
	scope: LeaderboardScope;
	onScopeChange: (scope: LeaderboardScope) => void;
	loading: boolean;
};

export default function LeaderboardTable({
	players,
	currentUserId,
	scope,
	onScopeChange,
	loading,
}: LeaderboardTableProps) {
	const sortedPlayers = useMemo(() => {
		return [...players].sort(
			(a, b) => b.winRate - a.winRate
		);
	}, [players]);

	return (
		<div className={styles.container}>
			{/* All Players / Friends tabs */}
			<div className={styles.tabs}>
				<button
					className={
						scope === "all"
							? styles.activeTab
							: styles.tab
					}
					onClick={() => onScopeChange("all")}
				>
					All Players
				</button>

				<button
					className={
						scope === "friends"
							? styles.activeTab
							: styles.tab
					}
					onClick={() => onScopeChange("friends")}
				>
					Friends
				</button>
			</div>

			{/* Leaderboard table */}
			<div className={styles.tableWrapper}>
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
											src={player.avatarUrl}
											alt={`${player.username}'s avatar`}
											className={styles.avatar}
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

				{loading && (
					<div className={styles.loadingOverlay}>
						<span>Loading...</span>
					</div>
				)}
			</div>
		</div>
	);
}