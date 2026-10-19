import { Friend } from "@/types/types.dto";

import clsx from "clsx";
import styles from "./ChatHeader.module.scss";

interface Props {
	user: Friend;
	// back to the friends list (phones only, where one pane shows at a time)
	onBack?: () => void;
}

export default function ChatHeader({
	user,
	onBack,
}: Props) {
	return (
		<div className="flex items-center gap-2 border-b border-xp-gray-450 bg-xp-classic-face p-2">
			{onBack && (
				<button
					type="button"
					className={clsx(styles.back, "hidden h-7 shrink-0 px-2 font-xp text-xp-sm text-xp-ink max-[600px]:block")}
					onClick={onBack}
					aria-label="Back to friends list"
				>
					‹ Back
				</button>
			)}

			<div className="flex size-10 shrink-0 items-center justify-center overflow-hidden border border-xp-gray-450 bg-xp-classic-gray text-xp-xl font-bold">
				{user.avatarUrl ? (
					<img
						src={user.avatarUrl}
						alt={user.username}
						className="size-full object-cover"
					/>
				) : (
					user.username.charAt(0).toUpperCase()
				)}
			</div>

			<div className="flex min-w-0 flex-col gap-0.75">
				<div className="truncate text-xp-md font-bold text-xp-black">
					{user.username}
				</div>

				<div className="flex items-center gap-1.25 text-xp-sm text-xp-gray-600">
					<span
						className={clsx(
							"size-2 shrink-0 rounded-[50%] border border-xp-gray-700",
							user.isOnline ? "bg-xp-online-dark" : "bg-xp-gray-450",
						)}
					/>

					{user.isOnline
						? "Online"
						: "Offline"}
				</div>
			</div>
		</div>
	);
}