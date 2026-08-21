"use client";

import { useState } from "react";

import styles from "./ChatInput.module.scss";

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
		<div className={styles.input}>
			<textarea
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
				onClick={handleSend}
				disabled={!value.trim()}
			>
				Send
			</button>
		</div>
	);
}