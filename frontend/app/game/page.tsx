"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import GameCanvas from "../components/game/GameCanvas";
import GameModals from "../components/game/GameModals/GameModals";

import useGameSocket from "../components/game/GameModals/UseGameSockets";
import PlayerInfo from "../components/game/playerInfo/playerInfo";

import "./page.scss";

import {
	CustomizationTheme,
	customizationService,
} from "@/services/Customization.services";


export default function GamePage() {

	const router = useRouter();

	const game = useGameSocket();

	const [theme, setTheme] =
		useState<CustomizationTheme | null>(null);


	/*
		Load user's saved theme
		(or backend default theme)
	*/
	useEffect(() => {
		const loadTheme = async () => {
			try {
				const currentTheme =
					await customizationService.getMyTheme();

				console.log(
					"Loaded theme:",
					currentTheme
				);

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

		console.log(
			"Selected theme:",
			newTheme
		);

		setTheme(newTheme);

		game.setModalState("select");
	};



	return (
		<div className="game-page">

			<div className="game-container">

				<PlayerInfo
					side="left"
					username={
						game.currentUser
					}
					avatar="/default-avatar.png"
				/>


				{
					theme && (
						<GameCanvas
							theme={theme}
						/>
					)
				}


				<PlayerInfo
					side="right"
					username={
						game.opponentName
					}
					avatar="/default-avatar.png"
				/>

			</div>



			<GameModals

				opponentDisconnected={
					game.opponentDisconnected
				}

				onFindAnother={
					game.findAnotherPlayer
				}

				room={
					game.room
				}

				waitingRematch={
					game.waitingRematch
				}

				rematchRequested={
					game.rematchRequested
				}

				rematchDeclined={
					game.rematchDeclined
				}

				onRematch={
					game.requestRematch
				}

				onAcceptRematch={
					game.acceptRematch
				}

				onDeclineRematch={
					game.declineRematch
				}

				modalState={
					game.modalState
				}

				matchmakingStatus={
					game.matchmakingStatus
				}

				opponentName={
					game.opponentName
				}

				winner={
					game.winner
				}

				currentUser={
					game.currentUser
				}

				scoreLeft={
					game.scoreLeft
				}

				scoreRight={
					game.scoreRight
				}

				onStartOnline={
					game.joinQueue
				}

				onPlayFriend={
					game.playFriend
				}

				onCancel={
					game.cancelMatchmaking
				}

				onReset={
					game.resetGame
				}

				onCustomize={
					handleCustomize
				}

				onSaveTheme={
					handleSaveTheme
				}

				onBackToSelect={
					game.backToSelect
				}

				onExit={() => {
					game.resetGame();
					router.push("/home");
				}}
			/>

		</div>
	);
}