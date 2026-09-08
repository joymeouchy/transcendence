"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
	MatchHistory as MatchHistoryType,
	UserService,
} from "@/services/user.services";

import { useAuth } from "@/context/AuthContext";

import DesktopLayout from "../components/DesktopLayout/DesktopLayout";
import XPWindow from "../components/ui/XPWindow/XPWindow";

import MatchHistory from "../components/matchHistory/matchHistory";
import Leaderboard from "../components/leaderboard/leaderboard";

import styles from "./gameStats.module.scss";
import { LeaderboardPlayer } from "../components/leaderboard/leaderboardPodium/leaderboardPodium";

const dummyPlayers: LeaderboardPlayer[] = [
	{
		id: 1,
		username: "Shadow",
		avatarUrl: null,
		wins: 18,
		losses: 2,
		winRate: 90,
	},
	{
		id: 2,
		username: "PongMaster",
		avatarUrl: null,
		wins: 15,
		losses: 5,
		winRate: 75,
	},
	{
		id: 3,
		username: "Speedy",
		avatarUrl: null,
		wins: 12,
		losses: 6,
		winRate: 66.67,
	},
	{
		id: 4,
		username: "Ace",
		avatarUrl: null,
		wins: 10,
		losses: 8,
		winRate: 55.56,
	},
	{
		id: 5,
		username: "PlayerOne",
		avatarUrl: null,
		wins: 8,
		losses: 8,
		winRate: 50,
	},
	{
		id: 6,
		username: "Rally",
		avatarUrl: null,
		wins: 6,
		losses: 10,
		winRate: 37.5,
	},
	{
		id: 7,
		username: "Newbie",
		avatarUrl: null,
		wins: 3,
		losses: 12,
		winRate: 20,
	},
	{
		id: 15,
		username: "You",
		avatarUrl: null,
		wins: 11,
		losses: 4,
		winRate: 73.33,
	},
];

type GameStatsTab = "history" | "leaderboard";

export default function GameStatsPage() {
	const router = useRouter();
	const { user } = useAuth();

	const [activeTab, setActiveTab] =
		useState<GameStatsTab>("history");

	const [matches, setMatches] =
		useState<MatchHistoryType[]>([]);

	const [loading, setLoading] =
		useState(true);

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
								players={dummyPlayers}
								currentUserId={user?.id}
							/>
						)}
					</div>
				</div>
			</XPWindow>
		</DesktopLayout>
	);
}