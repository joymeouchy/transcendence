"use client";

import { useState } from "react";

import MatchSelectModal from "./MatchSelectModal/MatchSelectModal";
import FriendSelectModal from "./FriendSelectModal/FriendSelectModal";

import MatchmakingModal from "./MatchMakingModal/MatchmakingModal";
import GameOverModal from "./MatchMakingModal/GameOverModal";
import CustomizationModal from "./CustomizationModal/CustomizationModal";
import RematchRequestModal from "./RematchRequestModal/RematchRequestModal";
import OpponentDisconnectedModal from "./MatchMakingModal/OpponentDisconnectedModal";

import { Friend } from "@/services/friendships.service";
import { MatchmakingStatus } from "./MatchMakingModal/MatchmakingModal";
import { CustomizationTheme } from "@/services/Customization.services";

interface Props {
	modalState:
	| "select"
	| "customization"
	| "matchmaking"
	| "playing"
	| "result";

	waitingRematch: boolean;
	rematchRequested: boolean;
	rematchDeclined: boolean;
	opponentDisconnected: boolean;
	matchmakingStatus: MatchmakingStatus;
	opponentName: string;
	winner: string;
	currentUser: string;
	scoreLeft: number;
	scoreRight: number;

	onRematch: () => void;
	onAcceptRematch: () => void;
	onDeclineRematch: () => void;
	onStartOnline: () => void;
	onPlayFriend: (friend: Friend) => void;
	onCancel: () => void;
	onExit: () => void;
	onReset: () => void;
	onCustomize: () => void;
	onSaveTheme: (theme: CustomizationTheme) => void;
	onBackToSelect: () => void;
	onFindAnother: () => void;
	onCancelInvite: () => void;
}

export default function GameModals({
	waitingRematch,
	rematchRequested,
	rematchDeclined,
	opponentDisconnected,
	onRematch,
	onAcceptRematch,
	onDeclineRematch,
	onFindAnother,
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
	onCancelInvite,
}: Props) {
	const [showFriendSelect, setShowFriendSelect] =
		useState(false);

	const handlePlayFriend = () => {
		setShowFriendSelect(true);
	};

	const handleSelectFriend = (friend: Friend) => {
		setShowFriendSelect(false);
		onPlayFriend(friend);
	};

	return (
		<>
			<MatchSelectModal
				isOpen={
					modalState === "select" &&
					!showFriendSelect
				}
				onStartOnline={onStartOnline}
				onPlayFriend={handlePlayFriend}
				onCustomize={onCustomize}
				onBack={onExit}
				onReturnHome={onExit}
			/>

			<FriendSelectModal
				isOpen={showFriendSelect}
				onClose={() => setShowFriendSelect(false)}
				onSelectFriend={handleSelectFriend}
			/>

			<CustomizationModal
				isOpen={modalState === "customization"}
				onBack={onBackToSelect}
				onSave={onSaveTheme}
			/>

			<MatchmakingModal
				isOpen={modalState === "matchmaking"}
				status={matchmakingStatus}
				opponentName={opponentName}
				onCancel={onCancel}
				onCancelInvite={onCancelInvite}
				onInviteResultClose={onBackToSelect}
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
				onFindAnother={onFindAnother}
				onExit={onReset}
			/>
		</>
	);
}