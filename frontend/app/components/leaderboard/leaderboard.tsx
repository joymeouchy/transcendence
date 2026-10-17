import LeaderboardPodium from "./leaderboardPodium/leaderboardPodium";

import LeaderboardTable from "./leaderboardTable/leaderboardTable";
import { LeaderboardPlayer } from "@/services/user.services";
import MyStats from "./MyStats/myStats";

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
		<div className="grid w-full min-w-0 grid-cols-[280px_minmax(0,1fr)] gap-xp-md max-[750px]:grid-cols-[1fr] max-[480px]:gap-xp-sm">
			<div>
				<LeaderboardPodium
					players={players}
					loading = {loading}
				/>

				<MyStats
					players={players}
					currentUserId={currentUserId}
				/>
			</div>

			<div className="w-full min-w-0">
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