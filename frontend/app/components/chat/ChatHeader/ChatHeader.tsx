import { Friend } from "@/types/types.dto";

import clsx from "clsx";

interface Props {
	user: Friend;
}

export default function ChatHeader({
	user,
}: Props) {
	return (
		<div className="flex items-center gap-2 border-b border-xp-gray-450 bg-xp-classic-face p-2">
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

			<div className="flex flex-col gap-0.75">
				<div className="text-xp-md font-bold text-xp-black">
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