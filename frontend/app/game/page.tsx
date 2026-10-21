"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  CustomizationTheme,
  customizationService,
} from "@/services/Customization.services";
import { socket } from "@/lib/socket";
import { tokenStorage } from "@/lib/token";
import { gameThemes } from "@/app/data/game/gameCustomization";
import { API_URL } from "@/lib/api";
import GameCanvas from "../components/game/GameCanvas";
import GameModals from "../components/game/GameModals/GameModals";
import useGameSocket from "../../hooks/UseGameSockets";
import PlayerInfo from "../components/game/playerInfo/playerInfo";

import "./page.scss";

export default function GamePage() {
  const router = useRouter();

  const game = useGameSocket();

  const [theme, setTheme] = useState<CustomizationTheme | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const currentTheme = await customizationService.getMyTheme();
        setTheme(currentTheme);
      } catch (error) {}
    };

    loadTheme();
  }, []);

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

  const handleSaveTheme = (newTheme: CustomizationTheme) => {
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
      className="game-page relative isolate flex h-dvh w-full items-center justify-center overflow-hidden bg-xp-app-bg"
      style={
        {
          "--game-background-image": `url("${backgroundImage}")`,
        } as React.CSSProperties
      }
    >
      <div className="game-page__background pointer-events-none absolute -inset-5 -z-1 bg-cover bg-center bg-no-repeat" />

      {/* 4:3 canvas sized by width and height; stacked HUDs need ~90px above and below */}
      <div className="relative flex w-[min(78vw,calc((100dvh_-_100px)*4/3))] min-w-0 shrink items-center justify-center gap-4 game-stacked:w-[min(94vw,calc((100dvh_-_180px)*4/3))] game-stacked:flex-col game-stacked:gap-0">
        <PlayerInfo
          side={game.playerSide}
          username={game.currentUser}
          avatar={game.playerAvatar}
          effect={playerEffect}
        />

        {
          <GameCanvas
            theme={theme}
            playerSide={game.playerSide}
            pendingPowerUp={game.pendingPowerUp}
          />
        }

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
