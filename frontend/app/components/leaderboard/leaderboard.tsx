
import { LeaderboardPlayer } from "@/services/user.services";
import LeaderboardTable from "./leaderboardTable/leaderboardTable";

import MyStats from "./MyStats/myStats";

import styles from "./leaderboard.module.scss";

type LeaderboardScope = "all" | "friends";

type LeaderboardProps = {
	players: LeaderboardPlayer[];
	currentUserId?: number;
	scope: LeaderboardScope;
	onScopeChange: (scope: LeaderboardScope) => void;
	loading: boolean;
};

export default function Leaderboard({
	players,
	currentUserId,
	scope,
	onScopeChange,
	loading,
}: LeaderboardProps) {
	return (
		<div className={styles.leaderboard}>
			<div className={styles.podium}>
				<LeaderboardPodium
					players={players}
				/>

				<MyStats
					players={players}
					currentUserId={currentUserId}
				/>
			</div>

			<div className={styles.table}>
				<LeaderboardTable
					players={players}
					currentUserId={currentUserId}
					scope={scope}
					onScopeChange={onScopeChange}
					loading={loading}
				/>
			</div>
		</div>
	);
}