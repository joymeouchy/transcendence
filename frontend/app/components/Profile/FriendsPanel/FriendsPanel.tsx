"use client";

import { useState } from "react";
import styles from "./FriendsPanel.module.scss";

type Friend = {
	id: number;
	name: string;
	status: "online" | "offline";
};

export default function FriendsPanel() {
	const [friends, setFriends] = useState<Friend[]>([
		{ id: 1, name: "Neo", status: "online" },
		{ id: 2, name: "Trinity", status: "offline" },
	]);

	const [input, setInput] = useState("");

	const addFriend = () => {
		if (!input.trim()) return;

		setFriends((prev) => [
			...prev,
			{
				id: Date.now(),
				name: input,
				status: "offline",
			},
		]);

		setInput("");
	};

	return (
		<div className={styles.groupBox}>
  <div className={styles.groupTitle}>Friends</div>

  <div className={styles.addBar}>
    <input
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Add friend..."
      className={styles.input}
    />
    <button onClick={addFriend} className={styles.button}>
      Add
    </button>
  </div>

  <div className={styles.list}>
    {friends.map((f) => (
      <div key={f.id} className={styles.friend}>
        <span className={`${styles.dot} ${styles[f.status]}`} />
        {f.name}
      </div>
    ))}
  </div>
</div>
	);
}

