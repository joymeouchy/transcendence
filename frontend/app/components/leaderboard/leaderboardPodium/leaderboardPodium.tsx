"use client";

import clsx from "clsx";
import { LeaderboardPlayer } from "@/services/user.services";
import styles from "./leaderboardPodium.module.scss";
import XPCard from "../../ui/XPCard/XPCard";
import XPSkeleton from "../../ui/XPSkeleton/XPSkeleton";

type LeaderboardPodiumProps = {
  players: LeaderboardPlayer[];
  loading: boolean;
};

// Per-rank look: medal (colors from the $medals SCSS map), step height.
const ranks = {
  1: { medal: "gold", step: "h-15.5", stack: "z-2" },
  2: { medal: "silver", step: "h-10.5", stack: "" },
  3: { medal: "bronze", step: "h-8", stack: "" },
} as const;

const playerClass = "relative w-[33.33%] min-w-0 text-center";

export default function LeaderboardPodium({
  players,
  loading,
}: LeaderboardPodiumProps) {
  const first = players[0];
  const second = players[1];
  const third = players[2];

  return (
    <XPCard title="Top Players">
      <div className="flex items-end justify-center px-0.5 pt-1.5 pb-0 max-[480px]:px-0">
        {loading ? (
          <>
            <PodiumSkeleton rank={2} />
            <PodiumSkeleton rank={1} />
            <PodiumSkeleton rank={3} />
          </>
        ) : (
          <>
            {second && <PodiumPlayer player={second} rank={2} />}
            {first && <PodiumPlayer player={first} rank={1} />}
            {third && <PodiumPlayer player={third} rank={3} />}
          </>
        )}
      </div>
    </XPCard>
  );
}

function PodiumStep({ rank }: { rank: 1 | 2 | 3 }) {
  return (
    <div
      className={clsx(
        styles.base,
        styles[`base--${ranks[rank].medal}`],
        ranks[rank].step,
        "mt-1.25 -ml-0.5 flex items-center justify-center rounded-t-xp-sm text-[15px] font-bold text-xp-gray-800",
      )}
    >
      {rank}
    </div>
  );
}

function PodiumSkeleton({ rank }: { rank: 1 | 2 | 3 }) {
  return (
    <div className={clsx(playerClass, ranks[rank].stack, "pointer-events-none")}>
      <XPSkeleton as="div" className="mx-auto mb-2 size-6 rounded-xp-sm" />
      <XPSkeleton as="div" className="mx-auto mb-2 size-12 rounded-xp-sm" />
      <XPSkeleton as="div" className="mx-auto mb-2 h-3 w-[75%] rounded-xp-sm" />
      <XPSkeleton as="div" className="mx-auto mb-1.5 h-3.5 w-[40%] rounded-xp-sm" />
      <XPSkeleton as="div" className="mx-auto mb-2 h-2.5 w-[55%] rounded-xp-sm" />
      <PodiumStep rank={rank} />
    </div>
  );
}

function PodiumPlayer({
  player,
  rank,
}: {
  player: LeaderboardPlayer;
  rank: 1 | 2 | 3;
}) {
  const avatarClass =
    "mx-auto mb-1.25 flex size-11.5 items-center justify-center rounded-xp-sm border-2 border-xp-blue bg-xp-white text-[17px] font-bold text-xp-blue max-[480px]:size-10";

  return (
    <div className={clsx(playerClass, ranks[rank].stack)}>
      <div className={clsx(styles.medal, "h-7 text-xp-4xl leading-7 max-[480px]:h-6 max-[480px]:text-[19px] max-[480px]:leading-6")}>
        {rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}
      </div>

      {player.avatarUrl ? (
        <img
          src={player.avatarUrl}
          alt={`${player.username}'s avatar`}
          className={clsx(avatarClass, "object-cover")}
        />
      ) : (
        <div className={avatarClass}>
          {player.username.charAt(0).toUpperCase()}
        </div>
      )}

      <div className="truncate px-0.75 text-xp-sm font-bold max-[480px]:text-xp-xs">{player.username}</div>
      <div className={clsx(styles[`rate--${ranks[rank].medal}`], "mt-0.5 text-[15px] font-bold max-[480px]:text-xp-md")}>{player.winRate}%</div>
      <div className="mt-px text-xp-2xs opacity-70 max-[480px]:text-xp-3xs">
        {player.wins}W / {player.losses}L
      </div>
      <PodiumStep rank={rank} />
    </div>
  );
}
