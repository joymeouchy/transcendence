"use client";

import { useRouter } from "next/navigation";

import GameCanvas from "../components/game/GameCanvas";
import GameModals from "../components/game/GameModals/GameModals";

import useGameSocket from "../components/game/GameModals/UseGameSockets";

import "./page.scss";

import {
	CustomizationTheme,
} from "@/services/Customization.services";


export default function GamePage() {

	const router = useRouter();

	const game = useGameSocket();



	const handleCustomize = () => {

		game.setModalState(
			"customization"
		);

	};



	const handleSaveTheme = (
		theme: CustomizationTheme
	) => {

		console.log(
			"Selected theme:",
			theme
		);


		game.setModalState(
			"select"
		);

	};



	return (

		<div className="game-page">


			<div className="game-container">

				<GameCanvas />

			</div>



			<GameModals

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


					router.push(
						"/home"
					);

				}}

			/>


		</div>

	);

}