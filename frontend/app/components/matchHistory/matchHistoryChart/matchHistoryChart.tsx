"use client";

import { useMemo } from "react";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

import { MatchHistory } from "@/services/user.services";

import styles from "./MatchHistoryChart.module.scss"

interface Props {
	matches: MatchHistory[];
}

export default function MatchHistoryChart({
	matches,
}: Props) {
	const graphData = useMemo(() => {
		let wins = 0;
		let losses = 0;

		return [...matches]
			.reverse()
			.map((match) => {
				if (match.result === "win")
					wins++;

				if (match.result === "loss")
					losses++;

				return {
					date: new Date(
						match.createdAt
					).toLocaleDateString(
						"en-US",
						{
							month: "short",
							day: "numeric",
						}
					),
					wins,
					losses,
				};
			});
	}, [matches]);

	return (
		<div className={styles.section}>
			<div className={styles.sectionTitle}>
				WINS / LOSSES OVER TIME
			</div>

			<div className={styles.chart}>
				{graphData.length === 0 ? (
					<div className={styles.empty}>
						No matches yet.
					</div>
				) : (
					<ResponsiveContainer
						width="100%"
						height={275}
					>
						<LineChart
							data={graphData}
							margin={{
								top: 10,
								right: 20,
								left: 0,
								bottom: 10,
							}}
						>
							<CartesianGrid
								strokeDasharray="3 3"
							/>

							<XAxis
								dataKey="date"
							/>

							<YAxis
								allowDecimals={
									false
								}
							/>

							<Tooltip />

							<Legend />

							<Line
								type="monotone"
								dataKey="wins"
								stroke="#008000"
								strokeWidth={2}
								dot={false}
							/>

							<Line
								type="monotone"
								dataKey="losses"
								stroke="#cc0000"
								strokeWidth={2}
								dot={false}
							/>
						</LineChart>
					</ResponsiveContainer>
				)}
			</div>
		</div>
	);
}