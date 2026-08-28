"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import {
	MatchHistory,
	UserService,
} from "@/services/user.services";

import DesktopLayout from "../components/DesktopLayout/DesktopLayout";
import XPWindow from "../components/ui/XPWindow/XPWindow";

import MatchStats from "../components/matchHistory/matchStats/matchStats";
import MatchHistoryChart from "../components/matchHistory/matchHistoryChart/matchHistoryChart";
import MatchList from "../components/matchHistory/matchList/matchList";

import styles from "./matchhistory.module.scss";

export type MatchFilter =
	| "all"
	| "win"
	| "loss"
	| "draw";

export default function MatchHistoryPage() {
	const router = useRouter();
	const { user } = useAuth();

	const [matches, setMatches] =
		useState<MatchHistory[]>([]);

	const [loading, setLoading] =
		useState(true);

	const [filter, setFilter] =
		useState<MatchFilter>("all");

	useEffect(() => {
		async function loadMatches() {
			if (!user) {
				setLoading(false);
				return;
			}

			try {
				const data =
					await UserService.getMatches();

				setMatches(data);
			} catch (error) {
				console.error(
					"Failed to load match history:",
					error
				);
			} finally {
				setLoading(false);
			}
		}

		loadMatches();
	}, [user]);

	const filteredMatches = useMemo(() => {
		if (filter === "all") {
			return matches;
		}

		return matches.filter(
			(match) =>
				match.result === filter
		);
	}, [matches, filter]);

	return (
		<DesktopLayout>
			<XPWindow
				title="Match History"
				onClose={() =>
					router.push("/home")
				}
			>
<div className={styles.page}>
	<MatchStats
		matches={matches}
	/>

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
</div>			</XPWindow>
		</DesktopLayout>
	);
}