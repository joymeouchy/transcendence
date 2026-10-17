import "./DesktopIcon.scss";
import Link from "next/link";

const iconClass =
	"xp-icon flex h-20.5 w-18 shrink-0 grow-0 basis-20.5 cursor-pointer flex-col items-center justify-start gap-1.5 border-none bg-transparent p-1 text-center font-xp text-xp-lg leading-[1.2] text-xp-white no-underline";

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
			<img src={image} alt={label} className="size-15 shrink-0 object-contain" />
			<span>{label}</span>
		</>
	);

	if (href) {
		return (
			<Link href={href} className={iconClass}>
				{content}
			</Link>
		);
	}

	return (
		<button
			className={iconClass}
			onClick={onClick}
			type="button"
		>
			{content}
		</button>
	);
}