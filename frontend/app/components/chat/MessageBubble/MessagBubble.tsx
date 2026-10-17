import clsx from "clsx";

import { Message } from "../MessageList/MessageList";

interface Props {
	message: Message;
	isMine: boolean;
}

export default function MessageBubble({
	message,
	isMine,
}: Props) {
	return (
		<div
			className={clsx(
				"mb-1.5 flex w-full min-w-0",
				isMine ? "justify-end" : "justify-start",
			)}
		>
			<div
				className={clsx(
					"max-w-[70%] min-w-0 rounded-xp-xs border px-2 py-1.25 max-[500px]:max-w-[85%] max-[500px]:px-1.75",
					isMine
						? "border-xp-border-dark bg-xp-row-hover"
						: "border-xp-gray-250 bg-xp-gray-10",
				)}
			>
				<div className="font-xp text-xp-sm leading-[15px] text-xp-gray-900 [overflow-wrap:anywhere] [word-break:break-word]">
					{message.content}
				</div>

				<div className="mt-0.5 text-right font-xp text-xp-3xs leading-[10px] text-xp-gray-500">
					{new Date(
						message.createdAt
					).toLocaleTimeString([], {
						hour: "2-digit",
						minute: "2-digit",
					})}
				</div>
			</div>
		</div>
	);
}
