"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CustomizationTheme, customizationService, } from "@/services/Customization.services";

import GameCanvas from "../components/game/GameCanvas";
import GameModals from "../components/game/GameModals/GameModals";
import useGameSocket from "../components/game/GameModals/UseGameSockets";
import PlayerInfo from "../components/game/playerInfo/playerInfo";

import "./page.scss";

export default function GamePage() {

	const router = useRouter();

	const game = useGameSocket();

	const [theme, setTheme] =
		useState<CustomizationTheme | null>(null);

const [activeEffects, setActiveEffects] = useState<{
		left: {
			type: string;
			expiresAt: number;
		} | null;
		right: {
			type: string;
			expiresAt: number;
		} | null;
	}>({
		left: null,
		right: null,
	});
	useEffect(() => {
		const loadTheme = async () => {
			try {
				const currentTheme =
					await customizationService.getMyTheme();
				setTheme(currentTheme);

			} catch (error) {
				console.error(
					"Failed to load theme:",
					error
				);
			}
		};

		loadTheme();

	}, []);

	const handleCustomize = () => {
		game.setModalState("customization");
	};

	const handleSaveTheme = (
		newTheme: CustomizationTheme
	) => {
		setTheme(newTheme);
		game.setModalState("select");
	};

	const playerEffect =
		game.playerSide === "left"
			? game.activeEffects.left
			: game.activeEffects.right;

	const opponentEffect =
		game.playerSide === "left"
			? game.activeEffects.right
			: game.activeEffects.left;

	return (
		<div className="game-page">

			<div className="game-container">

				<PlayerInfo
					side={game.playerSide}
					username={game.currentUser}
					avatar={game.playerAvatar}
					effect={playerEffect}
				/>

				{<GameCanvas theme={theme} />}

				<PlayerInfo
					side={game.playerSide === "left" ? "right" : "left"}
					username={game.opponentName}
					avatar={game.opponentAvatar}
					effect={opponentEffect}
				/>

			</div>

			<GameModals
				opponentDisconnected={game.opponentDisconnected}
				onFindAnother={game.findAnotherPlayer}
				room={game.room}
				waitingRematch={game.waitingRematch}
				rematchRequested={game.rematchRequested}
				rematchDeclined={game.rematchDeclined}
				onRematch={game.requestRematch}
				onAcceptRematch={game.acceptRematch}
				onDeclineRematch={game.declineRematch}
				modalState={game.modalState}
				matchmakingStatus={game.matchmakingStatus}
				opponentName={game.opponentName}
				winner={game.winner}
				currentUser={game.currentUser}
				scoreLeft={game.scoreLeft}
				scoreRight={game.scoreRight}
				onStartOnline={game.joinQueue}
				onCancel={game.cancelMatchmaking}
				onReset={game.resetGame}
				onCustomize={handleCustomize}
				onSaveTheme={handleSaveTheme}
				onBackToSelect={game.backToSelect}
				onPlayFriend={game.inviteFriend}
				incomingInvite={game.incomingInvite}
				onRespondToInvite={game.respondToInvite}
				onCancelInvite={game.cancelInvite}
				onExit={() => {
					game.resetGame();
					router.push("/home");
				}}
			/>

		</div>
	);
}