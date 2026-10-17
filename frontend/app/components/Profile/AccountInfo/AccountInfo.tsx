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
		<div className="flex flex-col gap-1.5 font-xp text-xp-base max-[600px]:gap-1.25 max-[600px]:text-xp-sm">
			{info.map((item) => (
				<div key={item.label}>
					{item.label}: {item.value}
				</div>
			))}
		</div>
	);
}