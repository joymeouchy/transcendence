"use client";

import MatchSelectModal from "./MatchSelectModal/MatchSelectModal";
import MatchmakingModal from "./MatchMakingModal/MatchmakingModal";
import GameOverModal from "./MatchMakingModal/GameOverModal";
import CustomizationModal from "./CustomizationModal/CustomizationModal";

import { socket } from "@/lib/socket";

import { MatchmakingStatus } from "./MatchMakingModal/MatchmakingModal";
// import { GameTheme } from "@/app/data/game/gameCustomization";

import { CustomizationTheme } from "@/services/Customization.services";

interface Props {
	modalState:
	| "select"
	| "customization"
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

	onCustomize: () => void;

	onSaveTheme: (theme: CustomizationTheme) => void;

	onBackToSelect: () => void;
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
	onCustomize,
	onSaveTheme,
	onBackToSelect,
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
				onCustomize={
					onCustomize
				}
				onBack={
					onExit
				}
				onReturnHome={
					onExit
				}
			/>



			<CustomizationModal
				isOpen={
					modalState === "customization"
				}
				onBack={
					onBackToSelect
				}
				onSave={
					onSaveTheme
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