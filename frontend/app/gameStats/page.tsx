"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
	MatchHistory as MatchHistoryType,
	UserService,
	LeaderboardPlayer,
} from "@/services/user.services";

import { useAuth } from "@/context/AuthContext";

import DesktopLayout from "../components/DesktopLayout/DesktopLayout";
import XPWindow from "../components/ui/XPWindow/XPWindow";

import MatchHistory from "../components/matchHistory/matchHistory";
import Leaderboard from "../components/leaderboard/leaderboard";

import styles from "./gameStats.module.scss";

type GameStatsTab = "history" | "leaderboard";
export type LeaderboardScope = "all" | "friends";

export default function GameStatsPage() {
	const router = useRouter();
	const { user } = useAuth();

	const [activeTab, setActiveTab] =
		useState<GameStatsTab>("history");

	const [leaderboard, setLeaderboard] = useState<
		LeaderboardPlayer[]
	>([]);

	const [leaderboardScope, setLeaderboardScope] =
		useState<LeaderboardScope>("all");

	const [matches, setMatches] =
		useState<MatchHistoryType[]>([]);

	const [leaderboardLoading, setLeaderboardLoading] =
		useState(true);

	// Load match history once
	useEffect(() => {
		async function loadMatches() {
			if (!user) {
				return;
			}

			try {
				const matchesData =
					await UserService.getMatches();

				setMatches(matchesData);
			} catch (error) {
				console.error(
					"Failed to load match history:",
					error
				);
			}
		}

		loadMatches();
	}, [user]);

	// Load leaderboard whenever the scope changes
	useEffect(() => {
		async function loadLeaderboard() {
			if (!user) {
				setLeaderboardLoading(false);
				return;
			}

			setLeaderboardLoading(true);

			try {
				const leaderboardData =
					await UserService.getLeaderboard(
						leaderboardScope
					);

				setLeaderboard(leaderboardData);
			} catch (error) {
				console.error(
					"Failed to load leaderboard:",
					error
				);
			} finally {
				setLeaderboardLoading(false);
			}
		}

		loadLeaderboard();
	}, [user, leaderboardScope]);

	return (
		<DesktopLayout>
			<XPWindow
				title="Game Stats"
				onClose={() => router.push("/home")}
			>
				<div className={styles.page}>
					<div className={styles.tabs}>
						<button
							className={
								activeTab === "history"
									? styles.activeTab
									: styles.tab
							}
							onClick={() =>
								setActiveTab("history")
							}
						>
							Match History
						</button>

						<button
							className={
								activeTab === "leaderboard"
									? styles.activeTab
									: styles.tab
							}
							onClick={() =>
								setActiveTab("leaderboard")
							}
						>
							Leaderboard
						</button>
					</div>

					<div className={styles.content}>
						{activeTab === "history" && (
							<MatchHistory
								matches={matches}
							/>
						)}

						{activeTab === "leaderboard" && (
							<Leaderboard
								players={leaderboard}
								currentUserId={user?.id}
								scope={leaderboardScope}
								onScopeChange={
									setLeaderboardScope
								}
								loading={leaderboardLoading}
							/>
						)}
					</div>
				</div>
			</XPWindow>
		</DesktopLayout>
	);
}