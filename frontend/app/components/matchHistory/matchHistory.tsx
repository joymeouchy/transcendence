"use client";

import { useMemo, useState } from "react";

import {
	MatchHistory as MatchHistoryType,
} from "@/services/user.services";

import MatchStats from "./matchStats/matchStats";
import MatchHistoryChart from "./matchHistoryChart/matchHistoryChart";
import MatchList from "./matchList/matchList";

export type MatchFilter =
	| "all"
	| "win"
	| "loss"
	| "draw";

type MatchHistoryProps = {
	matches: MatchHistoryType[];
};

export default function MatchHistory({
	matches,
}: MatchHistoryProps) {
	const [filter, setFilter] =
		useState<MatchFilter>("all");

	const filteredMatches = useMemo(() => {
		if (filter === "all") {
			return matches;
		}

		return matches.filter(
			(match) => match.result === filter
		);
	}, [matches, filter]);

	return (
		<div className="flex w-full min-h-0 min-w-0 flex-col font-xp">
			<MatchStats matches={matches} />

			<div className="grid min-h-0 min-w-0 flex-1 grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-xp-md overflow-hidden max-[800px]:grid-cols-[1fr] max-[800px]:overflow-x-hidden max-[800px]:overflow-y-auto">
				<div className="flex min-h-0 min-w-0 flex-col overflow-hidden max-[800px]:min-h-80">
					<MatchList
						matches={filteredMatches}
						filter={filter}
						onFilterChange={setFilter}
					/>
				</div>

				<div className="flex min-h-0 min-w-0 flex-col gap-xp-md overflow-hidden max-[800px]:min-h-80">
					<MatchHistoryChart
						matches={matches}
					/>
				</div>
			</div>
		</div>
	);
}