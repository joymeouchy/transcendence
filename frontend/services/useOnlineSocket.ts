"use client";

import { useEffect, useState } from "react";

import { socket } from "@/lib/socket";

export function useOnlineSocket() {
	const [onlineUsers, setOnlineUsers] =
		useState<Record<number, boolean>>({});

	useEffect(() => {
		const handleOnlineChanged = (data: {
			userId: number;
			isOnline: boolean;
		}) => {
			setOnlineUsers((prev) => ({
				...prev,
				[data.userId]: data.isOnline,
			}));
		};

		socket.on(
			"online_changed",
			handleOnlineChanged
		);

		return () => {
			socket.off(
				"online_changed",
				handleOnlineChanged
			);
		};
	}, []);

	return { onlineUsers };
}