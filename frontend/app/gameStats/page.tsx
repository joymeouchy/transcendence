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

import clsx from "clsx";
import styles from "./gameStats.module.scss";

type GameStatsTab = "history" | "leaderboard";
export type LeaderboardScope = "all" | "friends";

const tabClass = (active: boolean) =>
  clsx(
    styles.tab,
    active && styles["tab--active"],
    "cursor-pointer rounded-t-xp-sm px-4 py-1.5 font-xp text-xp-base",
    active ? "relative top-px font-bold text-xp-ink" : "font-normal text-xp-white",
  );

export default function GameStatsPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<GameStatsTab>("history");

  const [leaderboard, setLeaderboard] = useState<LeaderboardPlayer[]>([]);

  const [leaderboardScope, setLeaderboardScope] =
    useState<LeaderboardScope>("all");

  const [matches, setMatches] = useState<MatchHistoryType[]>([]);

  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [matchesLoading, setMatchesLoading] = useState(true);

  // Load match history once
  useEffect(() => {
    async function loadMatches() {
      if (!user) {
        setMatchesLoading(false);
        return;
      }

      setMatchesLoading(true);

      try {
        const matchesData = await UserService.getMatches();
        setMatches(matchesData);
      } catch (error) {
      } finally {
        setMatchesLoading(false);
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
        const leaderboardData = await UserService.getLeaderboard(
          leaderboardScope
        );

        setLeaderboard(leaderboardData);
      } catch (error) {
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
        isLoading={
          activeTab === "history" ? matchesLoading : false
        }
        loadingMessage="Loading match history..."
      >
        <div className="flex w-full min-h-0 min-w-0 flex-col font-xp">
          <div className={clsx(styles.tabs, "mb-3 flex shrink-0 items-end gap-0.75")}>
            <button
              className={tabClass(activeTab === "history")}
              onClick={() => setActiveTab("history")}
            >
              Match History
            </button>

            <button
              className={tabClass(activeTab === "leaderboard")}
              onClick={() => setActiveTab("leaderboard")}
            >
              Leaderboard
            </button>
          </div>

          <div className="min-h-0 w-full min-w-0 flex-1 overflow-visible">
            {activeTab === "history" && <MatchHistory matches={matches} />}

            {activeTab === "leaderboard" && (
              <Leaderboard
                players={leaderboard}
                currentUserId={user?.id}
                scope={leaderboardScope}
                onScopeChange={setLeaderboardScope}
                loading={leaderboardLoading}
              />
            )}
          </div>
        </div>
      </XPWindow>
    </DesktopLayout>
  );
}
