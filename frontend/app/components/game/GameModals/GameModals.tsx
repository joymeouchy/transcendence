"use client";

import MatchSelectModal from "./MatchSelectModal/MatchSelectModal";
import MatchmakingModal from "./MatchMakingModal/MatchmakingModal";
import GameOverModal from "./MatchMakingModal/GameOverModal";
import CustomizationModal from "./CustomizationModal/CustomizationModal";
import RematchRequestModal from "./RematchRequestModal/RematchRequestModal";
import OpponentDisconnectedModal from "./MatchMakingModal/OpponentDisconnectedModal";
import { MatchmakingStatus } from "./MatchMakingModal/MatchmakingModal";
// import { GameTheme } from "@/app/data/game/gameCustomization";

import { CustomizationTheme } from "@/services/Customization.services";

interface Props {

	room: string;

	waitingRematch: boolean;

	rematchRequested: boolean;
	rematchDeclined: boolean;
opponentDisconnected: boolean;
	onRematch: () => void;

	onAcceptRematch: () => void;

	onDeclineRematch: () => void;

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
	room,
	waitingRematch,
	rematchRequested,
	rematchDeclined,
	onRematch,
	onAcceptRematch,
	onDeclineRematch,
		opponentDisconnected,
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
				isOpen={modalState === "result"}

				winner={winner}

				currentUser={currentUser}

				scoreLeft={scoreLeft}

				scoreRight={scoreRight}

				waitingRematch={waitingRematch}

				rematchDeclined={rematchDeclined}

				onRematch={onRematch}

				onFindNew={onStartOnline}

				onExit={onReset}
			/>


			<RematchRequestModal
				isOpen={rematchRequested}

				opponentName={opponentName}

				onAccept={onAcceptRematch}

				onDecline={onDeclineRematch}
			/>

			<OpponentDisconnectedModal
	isOpen={opponentDisconnected}
	onFindAnother={onStartOnline}
	onExit={onReset}
/>

		</>
	);
}