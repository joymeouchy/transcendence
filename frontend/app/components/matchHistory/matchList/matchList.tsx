import { MatchHistory } from "@/services/user.services";

import { MatchFilter } from "../matchHistory";

import styles from "./matchList.module.scss";

interface Props {
	matches: MatchHistory[];
	filter: MatchFilter;
	onFilterChange: (
		filter: MatchFilter
	) => void;
}

export default function MatchList({
	matches,
	filter,
	onFilterChange,
}: Props) {
	const filters: MatchFilter[] = [
		"all",
		"win",
		"loss",
	];

	return (
		<div className={styles.section}>
			<div className={styles.header}>
				<div className={styles.sectionTitle}>
					MATCH HISTORY
				</div>

				<div className={styles.filters}>
					{filters.map(
						(value) => (
							<button
								key={value}
								className={
									filter ===
									value
										? styles.active
										: ""
								}
								onClick={() =>
									onFilterChange(
										value
									)
								}
							>
								{value
									.charAt(
										0
									)
									.toUpperCase() +
									value.slice(
										1
									)}
							</button>
						)
					)}
				</div>
			</div>

			<div className={styles.list}>
				{matches.length === 0 ? (
					<div className={styles.empty}>
						No matches found.
					</div>
				) : (
					matches.map(
						(match) => (
							<div
								key={
									match.id
								}
								className={
									styles.row
								}
							>
								<div
									className={
										styles.opponent
									}
								>
									{match
										.opponent
										.avatarUrl ? (
										<img
											src={
												match
													.opponent
													.avatarUrl
											}
											alt=""
										/>
									) : (
										<div
											className={
												styles.placeholder
											}
										>
											{
												match
													.opponent
													.username[0]
											}
										</div>
									)}

									<span>
										{
											match
												.opponent
												.username
										}
									</span>
								</div>

								<div
									className={
										styles.score
									}
								>
									{
										match.myScore
									}
									{" "}
									-
									{" "}
									{
										match.opponentScore
									}
								</div>

								<div
									className={`${styles.result} ${styles[match.result]}`}
								>
									{match.result.toUpperCase()}
								</div>

								<div
									className={
										styles.date
									}
								>
									{new Date(
										match.createdAt
									).toLocaleDateString(
										"en-US",
										{
											month: "short",
											day: "numeric",
											year: "numeric",
										}
									)}
								</div>
							</div>
						)
					)
				)}
			</div>
		</div>
	);
}