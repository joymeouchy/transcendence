"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CustomizationTheme, customizationService, } from "@/services/Customization.services";
import { socket } from "@/lib/socket";
import { tokenStorage } from "@/lib/token";
import { gameThemes } from "@/app/data/game/gameCustomization";
import { API_URL } from "@/lib/api";
import GameCanvas from "../components/game/GameCanvas";
import GameModals from "../components/game/GameModals/GameModals";
import useGameSocket from "../../hooks/UseGameSockets";
import PlayerInfo from "../components/game/playerInfo/playerInfo";
import { useRef } from "react";   // add useRef
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
			}
		};

		loadTheme();

	}, []);

	const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
    // Strict Mode re-mount: cancel the pending disconnect from the fake unmount
    if (leaveTimer.current) {
        clearTimeout(leaveTimer.current);
        leaveTimer.current = null;
    }

    if (!socket.connected) {
        socket.connect();
    }

    return () => {
        leaveTimer.current = setTimeout(() => {
            // disconnecting is what drops us from the queue or ends the match on the server
            socket.disconnect();

            // if the user is signed out, we don't want to reconnect
            // because we won't have a valid token
            if (tokenStorage.get()) {
                socket.connect();
            }
        }, 0);
    };
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
	const getBackgroundUrl = (path: string | null | undefined) => {
		if (!path) return "";

		if (path.startsWith("http") || path.startsWith("/pong")) {
			return path;
		}

		return `${API_URL}${path}`;
	};

	const backgroundImage = getBackgroundUrl(
		theme?.backgroundImageUrl ?? gameThemes.classic.background
	);

	return (
		<div
			className="game-page"
			style={{
				"--game-background-image": `url("${backgroundImage}")`,
			} as React.CSSProperties}
		>
			<div className="game-page__background" />

			<div className="game-container">

				<PlayerInfo
					side={game.playerSide}
					username={game.currentUser}
					avatar={game.playerAvatar}
					effect={playerEffect}
				/>

				{<GameCanvas theme={theme}
					pendingPowerUp={game.pendingPowerUp}
				/>}

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
				onCancelInvite={game.cancelInvite}
				onExit={() => {
					game.leaveGame();
					game.resetGame();
					router.push("/home");
				}}
			/>

		</div>
	);
}