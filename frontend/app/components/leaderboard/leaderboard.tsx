import LeaderboardPodium, {
	LeaderboardPlayer,
} from "./leaderboardPodium/leaderboardPodium";

import LeaderboardTable from "./leaderboardTable/leaderboardTable";

import MyStats from "./MyStats/myStats";

import styles from "./leaderboard.module.scss";

type LeaderboardProps = {
	players: LeaderboardPlayer[];
	currentUserId?: number;
};

export default function Leaderboard({
	players,
	currentUserId,
}: LeaderboardProps) {
	return (
		<div className={styles.leaderboard}>
			<div className={styles.podium}>
				<LeaderboardPodium
					players={players}
				/>
				<MyStats
			players={players}
			currentUserId={15}
		/>
			</div>

			<div className={styles.table}>
				<LeaderboardTable
					players={players}
					currentUserId={currentUserId}
				/>
			</div>
		</div>
	);
}