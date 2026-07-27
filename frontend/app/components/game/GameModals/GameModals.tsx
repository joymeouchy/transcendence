"use client";

import MatchSelectModal from "./MatchSelectModal/MatchSelectModal";
import MatchmakingModal from "./MatchMakingModal/MatchmakingModal";
import GameOverModal from "./MatchMakingModal/GameOverModal";

import { socket } from "@/lib/socket";

import { MatchmakingStatus } from "./MatchMakingModal/MatchmakingModal";

interface Props {
	modalState:
		| "select"
		| "matchmaking"
		| "playing"
		| "result";

	matchmakingStatus: MatchmakingStatus;

	opponentName: string;

	winner: string;

	currentUser: string;

	scoreLeft: number;

	scoreRight: number;

	onStartOnline: () => void;

	onPlayFriend: () => void;

	onCancel: () => void;

	onExit: () => void;

	onReset: () => void;
}

export default function GameModals({
	modalState,
	matchmakingStatus,
	opponentName,
	winner,
	currentUser,
	scoreLeft,
	scoreRight,
	onStartOnline,
	onPlayFriend,
	onCancel,
	onExit,
	onReset,
}: Props) {
	return (
		<>
			<MatchSelectModal
				isOpen={
					modalState === "select"
				}
				onStartOnline={
					onStartOnline
				}
				onPlayFriend={
					onPlayFriend
				}
				onBack={
					onExit
				}
				onReturnHome={
					onExit
				}
			/>

			<MatchmakingModal
				isOpen={
					modalState === "matchmaking"
				}
				status={
					matchmakingStatus
				}
				opponentName={
					opponentName
				}
				onCancel={
					onCancel
				}
			/>

			<GameOverModal
				isOpen={
					modalState === "result"
				}
				winner={
					winner
				}
				currentUser={
					currentUser
				}
				scoreLeft={
					scoreLeft
				}
				scoreRight={
					scoreRight
				}
				onRematch={() => {
					socket.emit(
						"request_rematch"
					);
				}}
				onFindNew={
					onStartOnline
				}
				onExit={
					onReset
				}
			/>
		</>
	);
}