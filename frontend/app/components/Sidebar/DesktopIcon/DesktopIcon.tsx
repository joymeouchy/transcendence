import "./DesktopIcon.scss";
import Link from "next/link";

type DesktopIconProps = {
	image: string;
	label: string;
	href?: string;
	onClick?: () => void;
};

export default function DesktopIcon({
	image,
	label,
	href,
	onClick,
}: DesktopIconProps) {
	const content = (
		<>
			<img src={image} alt={label} />
			<span>{label}</span>
		</>
	);

	if (href) {
		return (
			<Link href={href} className="xp-icon">
				{content}
			</Link>
		);
	}

	return (
		<button
			className="xp-icon"
			onClick={onClick}
			type="button"
		>
			{content}
		</button>
	);
}