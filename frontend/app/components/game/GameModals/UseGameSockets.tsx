"use client";

import { useEffect, useState } from "react";

import { socket } from "@/lib/socket";
import { useAuth } from "@/context/AuthContext";

import { MatchmakingStatus } from "./MatchMakingModal/MatchmakingModal";
import { GameStateSend } from "@/types/game_types";
import { images } from "@/lib/images";

type ModalState =
	| "select"
	| "customization"
	| "matchmaking"
	| "playing"
	| "result";


export default function useGameSocket() {

	const { user } = useAuth();

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

	const [playerSide, setPlayerSide] =
		useState<"left" | "right">("left");

	const [playerAvatar, setPlayerAvatar] =
		useState(images.defaultUserIcon);

	const [opponentAvatar, setOpponentAvatar] =
		useState(images.defaultUserIcon);


	const [room, setRoom] = useState("");

	const [rematchRequested, setRematchRequested] =
		useState(false);

	const [waitingRematch, setWaitingRematch] =
		useState(false);

	const [rematchDeclined, setRematchDeclined] =
		useState(false);

	const [opponentDisconnected, setOpponentDisconnected] =
		useState(false);

	const [pendingPowerUp, setPendingPowerUp] =
		useState<{
			type: string;
			side: "left" | "right";
			applyAt: number;
		} | null>(null);
	useEffect(() => {
		socket.connect();
		const handleConnect = () => {
			console.log(
				"Socket connected:",
				socket.id
			);
		};
		const handleMatchFound = (data: {
			room: string;
			players: [string, string];
			avatars: {
				left: string | null;
				right: string | null;
			};
		}) => {
			console.log("Match found!", data);

			setRoom(data.room);

			const [leftPlayer, rightPlayer] = data.players;

			if (user?.username === leftPlayer) {
				setPlayerSide("left");
				setOpponentName(rightPlayer);

				setPlayerAvatar(data.avatars.left ?? images.defaultUserIcon);
				setOpponentAvatar(data.avatars.right ?? images.defaultUserIcon);
			} else {
				setPlayerSide("right");
				setOpponentName(leftPlayer);

				setPlayerAvatar(data.avatars.right ?? images.defaultUserIcon);
				setOpponentAvatar(data.avatars.left ?? images.defaultUserIcon);
			}

			setMatchmakingStatus("found");

			setTimeout(() => {
				setModalState("playing");
			}, 1000);
		};

		const handleRematchRequested = () => {
			setRematchRequested(true);
		};
		const handleRematchAccepted = () => {
			setWaitingRematch(false);
			setRematchRequested(false);
		};

		const handleRematchDeclined = () => {
			setWaitingRematch(false);
			setRematchDeclined(true);
		};

		const handleRematchFailed = () => {
			setWaitingRematch(false);
			setRematchRequested(false);
		};

		const handleGameOver = (data: {
			winnerSocketId: string;
			winnerId: number;
			winnerUsername: string;
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
				data.winnerUsername
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

		const handleOpponentDisconnected = () => {

			setOpponentDisconnected(true);

		};

		const handlePowerUpIncoming = (data: {
			type: string;
			side: "left" | "right";
			applyAt: number;
		}) => {
			console.log(
				"Power up incoming:",
				data
			);
			setPendingPowerUp(data);
		};
		const handlePowerUpActivated = () => {
			setPendingPowerUp(null);
		};
		const handleGameState = (
			state: GameStateSend
		) => {
			setActiveEffects(
				state.activeEffects
			);
		};

		socket.on(
	"game_state",
	handleGameState
);

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
		socket.on(
			"rematch_requested",
			handleRematchRequested
		);
		socket.on(
			"rematch_accepted",
			handleRematchAccepted
		);
		socket.on(
			"rematch_declined",
			handleRematchDeclined
		);
		socket.on(
			"rematch_failed",
			handleRematchFailed
		);
		socket.on(
			"player_disconnected",
			handleOpponentDisconnected
		);
		socket.on(
			"power_up_incoming",
			handlePowerUpIncoming
		);
		socket.on(
			"power_up_activated",
			handlePowerUpActivated
		);
		return () => {
			socket.off(
				"connect",
				handleConnect
			);
			socket.off(
	"game_state",
	handleGameState
);
			socket.off(
				"match_found",
				handleMatchFound
			);
			socket.off(
				"game_over",
				handleGameOver
			);
			socket.off(
				"rematch_requested",
				handleRematchRequested
			);
			socket.off(
				"rematch_accepted",
				handleRematchAccepted
			);
			socket.off(
				"rematch_declined",
				handleRematchDeclined
			);
			socket.off(
				"rematch_failed",
				handleRematchFailed
			);
			socket.off(
				"player_disconnected",
				handleOpponentDisconnected
			);
			socket.off(
				"power_up_incoming",
				handlePowerUpIncoming
			);
			socket.off(
				"power_up_activated",
				handlePowerUpActivated
			);
		};
	}, [user]);

	const [activeEffects, setActiveEffects] =
		useState<GameStateSend["activeEffects"]>({
			left: null,
			right: null,
		});

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

	function backToSelect() {
		setModalState(
			"select"
		);
	}

	function requestRematch() {
		if (!room)
			return;

		socket.emit(
			"request_rematch",
			{
				room,
			}
		);
		setWaitingRematch(true);
	}

	function acceptRematch() {
		if (!room)
			return;

		socket.emit(
			"request_rematch",
			{
				room,
			}
		);
		setRematchRequested(false);

	}
	function declineRematch() {

		if (!room)
			return;
		socket.emit(
			"decline_rematch",
			{
				room,
			}
		);
		setRematchRequested(false);
		setRematchDeclined(false);
	}
	function findAnotherPlayer() {
		setOpponentDisconnected(false);
		setWinner("");
		setScoreLeft(0);
		setScoreRight(0);
		setOpponentName("");
		joinQueue();
	}

	function resetGame() {
		setWinner("");
		setOpponentName("");
		setScoreLeft(0);
		setScoreRight(0);
		setRoom("");
		setWaitingRematch(false);
		setRematchRequested(false);
		setRematchDeclined(false);
		setOpponentDisconnected(false);
		setPlayerSide("left");
		setModalState(
			"select"
		);
	}

	return {
		room,
		modalState,
		matchmakingStatus,
		playerSide,
		opponentName,
		winner,
		scoreLeft,
		scoreRight,
		currentUser: user?.username ?? "",
		waitingRematch,
		rematchRequested,
		rematchDeclined,
		opponentDisconnected,
		pendingPowerUp,
		setModalState,
		joinQueue,
		findAnotherPlayer,
		playFriend,
		cancelMatchmaking,
		backToSelect,
		resetGame,
		requestRematch,
		acceptRematch,
		declineRematch,
		playerAvatar,
		opponentAvatar,
		activeEffects,
	};
}