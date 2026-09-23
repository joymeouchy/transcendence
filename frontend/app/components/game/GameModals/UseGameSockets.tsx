"use client";

import { useEffect, useRef, useState } from "react";

import { socket } from "@/lib/socket";
import { useAuth } from "@/context/AuthContext";

import { MatchmakingStatus } from "./MatchMakingModal/MatchmakingModal";
import { GameStateSend } from "@/types/game_types";
import { images } from "@/lib/images";
import { playSound, sounds } from "@/lib/sounds";
import { Friend } from "@/services/friendships.service";
import FriendInviteModal from "./MatchMakingModal/FriendInviteModal";

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
	const [invitedFriendId, setInvitedFriendId] =
		useState<number | null>(null);
	const previousScore = useRef({
		left: 0,
		right: 0,
	});

	const [inviteResult, setInviteResult] = useState<
	"timeout" | "rejected" | null
>(null);

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


	const [incomingInvite, setIncomingInvite] = useState<{
		fromUserId: number;
		fromUsername: string;
		fromAvatarUrl: string | null;
	} | null>(null);

	const [inviteError, setInviteError] = useState("");

	const [inviteWaiting, setInviteWaiting] = useState(false);

	useEffect(() => {
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

			if (
				state.scores.left !== previousScore.current.left ||
				state.scores.right !== previousScore.current.right
			) {
				playSound(sounds.score);
			}

			previousScore.current = state.scores;
		};

		const handlePaddleHit = (data: {
			side: "left" | "right";
		}) => {
			if (data.side === "left") {
				playSound(sounds.leftpaddlehit);
			} else {
				playSound(sounds.rightpaddlehit);
			}
		};

		const handleInviteReceived = (data: {
			fromUserId: number;
			fromUsername: string;
			fromAvatarUrl: string | null;
		}) => {
			console.log("Friend invite received:", data);

			setIncomingInvite(data);
		};

		const handleInviteDeclined = (data: {
			fromUserId: number;
		}) => {
			console.log("Invite declined:", data);

			setInviteWaiting(false);
			setInvitedFriendId(null);
			setOpponentName("");
			setMatchmakingStatus("inviteRejected");
			setModalState("matchmaking");
		};

		const handleInviteTimeout = (data: {
			friendId: number;
		}) => {
			console.log("Invite timed out:", data);

			setInviteWaiting(false);
			setInvitedFriendId(null);
			setOpponentName("");
			setMatchmakingStatus("inviteTimeout");
			setModalState("matchmaking");
		};

		const handleInviteCancelled = (data: {
    fromUserId: number;
}) => {
    console.log("Invite cancelled:", data);

    setIncomingInvite((current) => {
        if (current?.fromUserId === data.fromUserId) {
            return null;
        }

        return current;
    });
};
		
	
const handleInviteError = (data: {
    message: string;
}) => {
    console.error("Invite error:", data.message);

    setInviteWaiting(false);
    setInviteError(data.message);
    setModalState("select");
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
		socket.on(
			"paddle_hit",
			handlePaddleHit
		);
		socket.on(
			"invite_received",
			handleInviteReceived
		);

		socket.on(
			"invite_declined",
			handleInviteDeclined
		);

		socket.on(
			"invite_timeout",
			handleInviteTimeout
		);

		socket.on(
			"invite_cancelled",
			handleInviteCancelled
		);

		socket.on(
			"invite_error",
			handleInviteError
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
			socket.off(
				"paddle_hit",
				handlePaddleHit
			);
			socket.off(
				"invite_received",
				handleInviteReceived
			);

			socket.off(
				"invite_declined",
				handleInviteDeclined
			);

			socket.off(
				"invite_timeout",
				handleInviteTimeout
			);

			socket.off(
				"invite_cancelled",
				handleInviteCancelled
			);

			socket.off(
				"invite_error",
				handleInviteError
			);
		};
	}, [user]);

	const [activeEffects, setActiveEffects] =
		useState<GameStateSend["activeEffects"]>({
			left: null,
			right: null,
		});
function closeInviteResult() {
    setInviteResult(null);
    setModalState("select");
}
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
	function inviteFriend(friend: Friend) {
		if (!socket.connected) {
			console.warn("Socket not connected");
			return;
		}

		setInviteError("");
		setInvitedFriendId(friend.id);
		setInviteWaiting(true);

		setOpponentName(friend.username);
		setMatchmakingStatus("waitingFriend");
		setModalState("matchmaking");

		socket.emit("invite_friend", {
			friendId: friend.id,
		});
	}
	function cancelInvite() {
		if (!socket.connected || invitedFriendId === null) return;

		socket.emit("cancel_invite", {
			friendId: invitedFriendId,
		});

		setInvitedFriendId(null);
		setInviteWaiting(false);
		setModalState("select");
	}

	function respondToInvite(
    fromUserId: number,
    accepted: boolean
) {
    if (!socket.connected) return;

    socket.emit("invite_response", {
        fromUserId,
        accepted,
    });

    setIncomingInvite(null);

    if (!accepted) {
        setModalState("select");
    }
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
		cancelMatchmaking,
		backToSelect,
		resetGame,
		requestRematch,
		acceptRematch,
		declineRematch,
		playerAvatar,
		opponentAvatar,
		activeEffects,
		incomingInvite,
		inviteError,
		inviteWaiting,
		inviteFriend,
		cancelInvite,
		respondToInvite,
		inviteResult,
closeInviteResult,
	};
}