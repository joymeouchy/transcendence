"use client";

import { Friend } from "@/types/types.dto";

import ChatHeader from "../ChatHeader/ChatHeader";
import MessageList, {
	Message,
} from "../MessageList/MessageList";
import ChatInput from "../ChatInput/ChatInput";

interface Props {
	user: Friend;
	currentUserId: number;
	messages: Message[];
	messagesLoading?: boolean;
	onSendMessage?: (message: string) => void;
	onBack?: () => void;
}

export default function ChatPanel({
	user,
	currentUserId,
	messages,
	messagesLoading,
	onSendMessage,
	onBack,
}: Props) {
	return (
		<div className="flex size-full min-h-0 flex-col">
			<ChatHeader user={user} onBack={onBack} />

			<MessageList
				messages={messages}
				currentUserId={currentUserId}
				messagesLoading={messagesLoading}
			/>

			<ChatInput
				onSend={
					onSendMessage ??
					(() => {})
				}
			/>
		</div>
	);
}