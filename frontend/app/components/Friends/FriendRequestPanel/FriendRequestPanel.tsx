"use client";

import { useState } from "react";

import styles from "./FriendRequestPanel.module.scss";

import { FriendRequest } from "@/types/types.dto";

interface Props {
	requests: FriendRequest[];

	onAccept?: (id: number) => Promise<void>;
	onReject?: (id: number) => Promise<void>;
}

export default function FriendRequestsPanel({
	requests,
	onAccept,
	onReject,
}: Props) {
	const [loadingId, setLoadingId] = useState<number | null>(null);

	async function handleAccept(id: number) {
		if (loadingId !== null) return;

		try {
			setLoadingId(id);
			await onAccept?.(id);
		} finally {
			setLoadingId(null);
		}
	}

	async function handleReject(id: number) {
		if (loadingId !== null) return;

		try {
			setLoadingId(id);
			await onReject?.(id);
		} finally {
			setLoadingId(null);
		}
	}

	return (
		<div className={styles.panel}>
			<div className={styles.title}>
				Friend Requests
			</div>

			<div className={styles.list}>
				{requests.length === 0 ? (
					<div className={styles.empty}>
						No requests
					</div>
				) : (
					requests.map((request) => {
						const isLoading = loadingId === request.id;

						return (
							<div
								key={request.id}
								className={styles.friend}
							>
								<span>
									{request.sender.username}
								</span>

								<button
									className={styles.friendButton}
									onClick={() => handleAccept(request.id)}
									disabled={loadingId !== null}
								>
									{isLoading ? "Loading..." : "Accept"}
								</button>

								<button
									className={styles.friendButton}
									onClick={() => handleReject(request.id)}
									disabled={loadingId !== null}
								>
									{isLoading ? "Loading..." : "Reject"}
								</button>
							</div>
						);
					})
				)}
			</div>
		</div >
	);
}