"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { LeaderboardPlayer } from "@/services/user.services";
import styles from "./leaderboardTable.module.scss";
import XPCard from "../../ui/XPCard/XPCard";
import XPSkeleton from "../../ui/XPSkeleton/XPSkeleton";

type LeaderboardScope = "all" | "friends";

type LeaderboardTableProps = {
	players: LeaderboardPlayer[];
	currentUserId?: number;
	scope: LeaderboardScope;
	onScopeChange: (scope: LeaderboardScope) => void;
	loading: boolean;
};

// shared grid for the header and every row
const gridClass =
	"grid min-w-107.5 grid-cols-[40px_minmax(120px,1fr)_45px_45px_75px] items-center gap-x-1.5";

const avatarClass =
	"flex size-7.5 shrink-0 items-center justify-center rounded-xp-sm border border-xp-border-dark bg-xp-white text-xp-base font-bold text-xp-blue";

export default function LeaderboardTable({
	players,
	currentUserId,
	scope,
	onScopeChange,
	loading,
}: LeaderboardTableProps) {
	const router = useRouter();

	const tabClass = (active: boolean) =>
		clsx(
			styles.tab,
			active && styles["tab--active"],
			"cursor-pointer rounded-t-xp-sm px-3 py-1.25 font-xp text-xp-sm",
			active ? "font-bold text-xp-white" : "text-xp-gray-900",
		);

	return (
		<XPCard>
			<div className="mb-xp-sm flex items-end gap-0.5">
				<button
					className={tabClass(scope === "all")}
					onClick={() => onScopeChange("all")}
				>
					All Players
				</button>

				<button
					className={tabClass(scope === "friends")}
					onClick={() => onScopeChange("friends")}
				>
					Friends
				</button>
			</div>

			<div className={clsx(styles.tableWrapper, "relative max-h-75 w-full overflow-auto")}>
				<div className="w-full min-w-125 overflow-x-auto overflow-y-hidden rounded-xp-sm border border-xp-groupbox-border">
					<div className={clsx(styles.header, gridClass, "cursor-pointer px-2 py-1.5 text-xp-sm font-bold text-xp-white")}>
						<span className="text-center text-xp-gray-700">#</span>
						<span className="flex min-w-0 items-center gap-2">Player</span>
						<span>W</span>
						<span>L</span>
						<span>Win Rate</span>
					</div>

					{loading ? (
						Array.from({ length: 5 }).map((_, index) => (
							<div
								key={index}
								className={clsx(styles.row, gridClass, "pointer-events-none min-h-10 cursor-default px-2 py-1.25 text-xp-sm text-xp-gray-900")}
							>
								<span className="text-center text-xp-gray-700">
									<XPSkeleton className="mx-auto h-3 w-4.5 rounded-xp-xs" />
								</span>

								<div className="flex min-w-0 items-center gap-2">
									<XPSkeleton className="size-7.5 min-w-7.5 shrink-0 rounded-xp-sm border border-xp-scroll-edge p-0" />
									<span className="block w-[65%]">
										<XPSkeleton className="h-3 w-full rounded-xp-xs" />
									</span>
								</div>

								<XPSkeleton className="mx-auto h-3 w-6 rounded-xp-xs" />
								<XPSkeleton className="mx-auto h-3 w-6 rounded-xp-xs" />
								<XPSkeleton className="mx-auto h-3 w-6 rounded-xp-xs" />
							</div>
						))
					) : (
						players.map((player) => {
							const isCurrentUser = player.id === currentUserId;

							return (
								<div
									key={player.id}
									className={clsx(
										styles.row,
										isCurrentUser && clsx(styles.currentUser, "font-bold"),
										gridClass,
										"min-h-10 cursor-pointer px-2 py-1.25 text-xp-sm text-xp-gray-900",
									)}
									role="link"
									tabIndex={0}
									onClick={() => router.push(`/profile/${player.id}`)}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											e.preventDefault();
											router.push(`/profile/${player.id}`);
										}
									}}
								>
									<span className={clsx("text-center", isCurrentUser ? "text-xp-blue" : "text-xp-gray-700")}>{player.rank}</span>

									<div className="flex min-w-0 items-center gap-2">
										{player.avatarUrl ? (
											<img
												src={player.avatarUrl}
												alt=""
												className={clsx(styles.avatar, avatarClass, "object-cover")}
											/>
										) : (
											<div className={clsx(styles.avatar, avatarClass)}>
												{player.username.charAt(0).toUpperCase()}
											</div>
										)}

										<span className="truncate">{player.username}</span>
									</div>

									<span>{player.wins}</span>
									<span>{player.losses}</span>
									<strong className="text-xp-blue">{player.winRate}%</strong>
								</div>
							);
						})
					)}
				</div>
			</div>
		</XPCard>
	);
}
