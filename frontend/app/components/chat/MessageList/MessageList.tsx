import { useEffect, useRef } from "react";

import MessageBubble from "../MessageBubble/MessagBubble";

import { Message } from "@/types/messages";
export type { Message };

interface Props {
	messages: Message[];
	currentUserId: number;
	messagesLoading?: boolean;
}

export default function MessageList({
	messages,
	currentUserId,
	messagesLoading,
}: Props) {
	const listRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		listRef.current?.scrollTo({
			top: listRef.current.scrollHeight,
			behavior: "smooth",
		});
	}, [messages]);

	return (
		<div
			ref={listRef}
			className="flex min-h-0 w-full min-w-0 flex-1 flex-col gap-1.5 overflow-x-hidden overflow-y-auto bg-xp-white px-2.5 py-2"
		>
			{messagesLoading ? (
				<div>Loading messages...</div>
			) : (
				messages.map((message) => (
					<MessageBubble
						key={message.id}
						message={message}
						isMine={
							message.senderId ===
							currentUserId
						}
					/>
				))
			)}
		</div>
	);
}