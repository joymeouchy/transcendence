"use client";

import { useRouter } from "next/navigation";
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
	const router = useRouter();

	return (
		<div className={styles.container}>
			<div className={styles.tabs}>
				<button
					className={scope === "all" ? styles.activeTab : styles.tab}
					onClick={() => onScopeChange("all")}
				>
					All Players
				</button>

				<button
					className={scope === "friends" ? styles.activeTab : styles.tab}
					onClick={() => onScopeChange("friends")}
				>
					Friends
				</button>
			</div>

			<div className={styles.tableWrapper}>
				<div className={styles.table}>
					<div className={styles.header}>
						<span className={styles.rank}>#</span>
						<span className={styles.player}>Player</span>
						<span>W</span>
						<span>L</span>
						<span>Win Rate</span>
					</div>

					{loading ? (
						Array.from({ length: 5 }).map((_, index) => (
							<div
								key={index}
								className={`${styles.row} ${styles.skeletonRow}`}
							>
								<span className={styles.rank}>
									<span className={styles.skeleton} />
								</span>

								<div className={styles.player}>
									<span className={`${styles.avatar} ${styles.skeleton}`} />
									<span className={styles.skeletonName}>
										<span className={styles.skeleton} />
									</span>
								</div>

								<span className={styles.skeleton} />
								<span className={styles.skeleton} />
								<span className={styles.skeleton} />
							</div>
						))
					) : (
						players.map((player) => {
							const isCurrentUser = player.id === currentUserId;

							return (
								<div
									key={player.id}
									className={`${styles.row} ${isCurrentUser ? styles.currentUser : ""
										}`}
									role="link"
									tabIndex={0}
									onClick={() => router.push(`/profile/${player.id}`)}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											e.preventDefault();
											router.push(`/profile/${player.id}`);
										}
									}}
								>
									<span className={styles.rank}>{player.rank}</span>

									<div className={styles.player}>
										{player.avatarUrl ? (
											<img
												src={player.avatarUrl}
												alt=""
												className={styles.avatar}
											/>
										) : (
											<div className={styles.avatarFallback}>
												{player.username.charAt(0).toUpperCase()}
											</div>
										)}

										<span>{player.username}</span>
									</div>

									<span>{player.wins}</span>
									<span>{player.losses}</span>
									<strong>{player.winRate}%</strong>
								</div>
							);
						})
					)}
				</div>
			</div>
		</div>
	);
}