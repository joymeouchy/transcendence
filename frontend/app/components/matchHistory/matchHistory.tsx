"use client";

import { useMemo, useState } from "react";

import {
	MatchHistory as MatchHistoryType,
} from "@/services/user.services";

import MatchStats from "./matchStats/matchStats";
import MatchHistoryChart from "./matchHistoryChart/matchHistoryChart";
import MatchList from "./matchList/matchList";

import styles from "./matchHistory.module.scss";

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
		<div className={styles.page}>
			<MatchStats matches={matches} />

			<div className={styles.dashboard}>
				<div className={styles.matchHistory}>
					<MatchList
						matches={filteredMatches}
						filter={filter}
						onFilterChange={setFilter}
					/>
				</div>

				<div className={styles.rightColumn}>
					<MatchHistoryChart
						matches={matches}
					/>
				</div>
			</div>
		</div>
	);
}