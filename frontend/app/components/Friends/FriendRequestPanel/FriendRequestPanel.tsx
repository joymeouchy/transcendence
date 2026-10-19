"use client";

import { useState } from "react";

import clsx from "clsx";
import styles from "./FriendRequestPanel.module.scss";
import XPListPanel, { XPListEmpty } from "../../ui/XPListPanel/XPListPanel";

const buttonClass = clsx(
	styles.friendButton,
	"min-w-19.5 px-1.75 py-1 font-xp text-xp-xs whitespace-nowrap max-[450px]:min-w-0 max-[450px]:flex-1",
);

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
		<XPListPanel title="Friend Requests" className="flex-1">
				{requests.length === 0 ? (
					<XPListEmpty>
						No requests
					</XPListEmpty>
				) : (
					requests.map((request) => {
						const isLoading = loadingId === request.id;

						return (
							<div
								key={request.id}
								className={clsx(
									styles.friend,
									"flex items-center justify-between gap-2 px-2 py-1.5 font-xp text-xp-sm text-xp-gray-900 max-[450px]:flex-col max-[450px]:items-stretch",
								)}
							>
								<span className="min-w-0 truncate" title={request.sender.username}>
									{request.sender.username}
								</span>

								<div className="flex shrink-0 gap-2">
									<button
										className={buttonClass}
										onClick={() => handleAccept(request.id)}
										disabled={loadingId !== null}
									>
										{isLoading ? "Loading..." : "Accept"}
									</button>

									<button
										className={buttonClass}
										onClick={() => handleReject(request.id)}
										disabled={loadingId !== null}
									>
										{isLoading ? "Loading..." : "Reject"}
									</button>
								</div>
							</div>
						);
					})
				)}
		</XPListPanel>
	);
}