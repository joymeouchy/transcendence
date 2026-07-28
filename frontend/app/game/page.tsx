"use client";

import { useRouter } from "next/navigation";

import GameCanvas from "../components/game/GameCanvas";
import GameModals from "../components/game/GameModals/GameModals";

import useGameSocket from "../components/game/GameModals/UseGameSockets";

import "./page.scss";

export default function GamePage() {
	const router = useRouter();

	const game = useGameSocket();

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