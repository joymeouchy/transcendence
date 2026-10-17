import { useMemo } from "react";

import { MatchHistory } from "@/services/user.services";

import clsx from "clsx";
import styles from "./matchStats.module.scss"

interface Props {
	matches: MatchHistory[];
}

export default function MatchStats({
	matches,
}: Props) {
	const stats = useMemo(() => {
		const wins = matches.filter(
			(match) => match.result === "win"
		).length;

		const losses = matches.filter(
			(match) => match.result === "loss"
		).length;

		const draws = matches.filter(
			(match) => match.result === "draw"
		).length;

		const total = matches.length;

		const winRate =
			total > 0
				? Math.round(
						(wins / total) * 100
					)
				: 0;

		return {
			total,
			wins,
			losses,
			draws,
			winRate,
		};
	}, [matches]);

	return (
		<div className="mb-xp-md grid min-w-0 grid-cols-4 gap-xp-sm max-[650px]:grid-cols-2 max-[400px]:gap-xp-xs">
			<StatBox label="MATCHES" value={stats.total} />
			<StatBox label="WINS" value={stats.wins} color="text-xp-win" />
			<StatBox label="LOSSES" value={stats.losses} color="text-xp-danger" />
			<StatBox label="WIN RATE" value={`${stats.winRate}%`} />
		</div>
	);
}

function StatBox({
	label,
	value,
	color = "text-xp-blue",
}: {
	label: string;
	value: number | string;
	color?: string;
}) {
	return (
		<div className={clsx(styles.statBox, "flex min-h-16.25 flex-col items-center justify-center rounded-xp-sm p-xp-sm font-xp max-[400px]:min-h-14.5 max-[400px]:p-1.5")}>
			<span className="mb-1 text-xp-xs font-bold whitespace-nowrap text-xp-slate max-[400px]:text-xp-2xs">
				{label}
			</span>

			<span className={clsx("text-xp-3xl leading-none font-bold max-[400px]:text-xp-2xl", color)}>
				{value}
			</span>
		</div>
	);
}
