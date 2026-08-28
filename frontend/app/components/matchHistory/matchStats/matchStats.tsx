import { useMemo } from "react";

import { MatchHistory } from "@/services/user.services";

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
		<div className={styles.stats}>
			<div className={styles.statBox}>
				<span className={styles.label}>
					MATCHES
				</span>

				<span className={styles.value}>
					{stats.total}
				</span>
			</div>

			<div className={styles.statBox}>
				<span className={styles.label}>
					WINS
				</span>

				<span
					className={`${styles.value} ${styles.win}`}
				>
					{stats.wins}
				</span>
			</div>

			<div className={styles.statBox}>
				<span className={styles.label}>
					LOSSES
				</span>

				<span
					className={`${styles.value} ${styles.loss}`}
				>
					{stats.losses}
				</span>
			</div>

			<div className={styles.statBox}>
				<span className={styles.label}>
					WIN RATE
				</span>

				<span className={styles.value}>
					{stats.winRate}%
				</span>
			</div>
		</div>
	);
}