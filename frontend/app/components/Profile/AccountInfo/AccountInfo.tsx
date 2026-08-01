import styles from "./AccountInfo.module.scss";

interface Props {
	username: string;
	email: string;
	totalMatches: number;
}

export default function AccountInfo({
	username,
	email,
	totalMatches,
}: Props) {
	const info = [
		{
			label: "Username",
			value: username,
		},
		{
			label: "Email",
			value: email,
		},
		{
			label: "Total Matches",
			value: totalMatches,
		},
	];

	return (
		<div className={styles.infoGrid}>
			{info.map((item) => (
				<div key={item.label}>
					{item.label}: {item.value}
				</div>
			))}
		</div>
	);
}