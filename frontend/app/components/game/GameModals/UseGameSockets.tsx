"use client";

import { useEffect, useState } from "react";

import { socket } from "@/lib/socket";

import { MatchmakingStatus } from "./MatchMakingModal/MatchmakingModal";

type ModalState =
	| "select"
	| "matchmaking"
	| "playing"
	| "result";

export default function useGameSocket() {
	const [modalState, setModalState] =
		useState<ModalState>("select");

	const [matchmakingStatus, setMatchmakingStatus] =
		useState<MatchmakingStatus>("searching");

	const [opponentName, setOpponentName] =
		useState("");

	const [winner, setWinner] =
		useState("");

	const [scoreLeft, setScoreLeft] =
		useState(0);

	const [scoreRight, setScoreRight] =
		useState(0);

	const [currentUser, setCurrentUser] =
		useState("");

	useEffect(() => {
		socket.connect();

		const handleConnect = () => {
			console.log(
				"Socket connected:",
				socket.id
			);

			setCurrentUser(
				socket.id ?? ""
			);
		};

		const handleMatchFound = (data: {
			room: string;
			players: string[];
		}) => {
			console.log(
				"Match found!",
				data
			);

			const opponent =
				data.players.find(
					(player) =>
						player !== socket.id
				);

			setOpponentName(
				opponent ?? "Opponent"
			);

			setMatchmakingStatus(
				"found"
			);

			setTimeout(() => {
				setModalState(
					"playing"
				);
			}, 1000);
		};

		const handleGameOver = (data: {
			winner: string;
			scores: {
				left: number;
				right: number;
			};
		}) => {
			console.log(
				"GAME OVER DATA:",
				data
			);

			setWinner(
				data.winner
			);

			setScoreLeft(
				data.scores.left
			);

			setScoreRight(
				data.scores.right
			);

			setModalState(
				"result"
			);
		};

		socket.on(
			"connect",
			handleConnect
		);

		socket.on(
			"match_found",
			handleMatchFound
		);

		socket.on(
			"game_over",
			handleGameOver
		);

		return () => {
			socket.off(
				"connect",
				handleConnect
			);

			socket.off(
				"match_found",
				handleMatchFound
			);

			socket.off(
				"game_over",
				handleGameOver
			);

			socket.disconnect();
		};
	}, []);

	function joinQueue() {
		if (!socket.connected) {
			console.warn(
				"Socket not connected yet"
			);

			return;
		}

		socket.emit(
			"join_queue"
		);

		setMatchmakingStatus(
			"searching"
		);

		setModalState(
			"matchmaking"
		);
	}

	function playFriend() {
		setMatchmakingStatus(
			"waitingFriend"
		);

		setModalState(
			"matchmaking"
		);
	}

	function cancelMatchmaking() {
		if (socket.connected) {
			socket.emit(
				"leave_queue"
			);
		}

		setOpponentName("");

		setModalState(
			"select"
		);
	}

	function resetGame() {
		setWinner("");

		setOpponentName("");

		setModalState(
			"select"
		);
	}

	return {
		modalState,
		setModalState,

		matchmakingStatus,

		opponentName,

		winner,
		scoreLeft,
		scoreRight,

		currentUser,

		joinQueue,
		playFriend,
		cancelMatchmaking,
		resetGame,
	};
}