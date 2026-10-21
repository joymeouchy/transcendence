"use client";

import { useState } from "react";

import clsx from "clsx";
import styles from "./ChatInput.module.scss";
import { MESSAGE_MAX_LENGTH } from "@/lib/validation";

interface Props {
	onSend: (message: string) => void;
}

export default function ChatInput({
	onSend,
}: Props) {
	const [value, setValue] = useState("");

	function handleSend() {
		const message = value.trim();

		if (!message)
			return;

		onSend(message);
		setValue("");
	}

	return (
		<div className="flex w-full shrink-0 items-end gap-1.5 border-t border-xp-groupbox-border bg-xp-tint-blue p-1.75">
			<textarea
				className={clsx(
					styles.textarea,
					"max-h-25 min-h-5.5 min-w-0 flex-1 resize-none overflow-y-auto rounded-xp-2xs px-1.5 py-1 font-xp text-xp-sm leading-[15px] outline-none",
				)}
				name="message"
				maxLength={MESSAGE_MAX_LENGTH}
				value={value}
				onChange={(e) =>
					setValue(e.target.value)
				}
				onKeyDown={(e) => {
					if (
						e.key === "Enter" &&
						!e.shiftKey
					) {
						e.preventDefault();
						handleSend();
					}
				}}
				placeholder="Type a message..."
			/>

			<button
				className={clsx(
					styles.send,
					"h-6 min-w-13.75 shrink-0 px-2.5 py-0.75 font-xp text-xp-sm whitespace-nowrap text-xp-ink",
				)}
				onClick={handleSend}
				disabled={!value.trim()}
			>
				Send
			</button>
		</div>
	);
}