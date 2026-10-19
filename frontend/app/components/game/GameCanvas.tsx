"use client";

import { useEffect, useRef, useState } from "react";
import PowerUpIncoming from "./PowerUps/PowerUpPowerUpIncoming";

import { socket } from "../../../lib/socket";
import { API_URL } from "@/lib/api";

import { GameStateSend, pongConfig } from "@/types/game_types";
import { gameThemes } from "@/app/data/game/gameCustomization";

import { CustomizationTheme } from "@/services/Customization.services";

// Touch: while a finger is down, nudge the paddle toward it at roughly the
// rate a held key auto-repeats, so touch and keyboard players move alike.
const TOUCH_MOVE_INTERVAL_MS = 33;

type Props = {
  theme: CustomizationTheme | null;
  playerSide: "left" | "right";
  pendingPowerUp: {
    type: string;
    side: "left" | "right";
    applyAt: number;
  } | null;
};

export default function GameCanvas({ theme, playerSide, pendingPowerUp }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // finger position in canvas units, null when not touching
  const touchTargetY = useRef<number | null>(null);
  const touchTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const gameState = useRef<GameStateSend | null>(null);
  const roomRef = useRef<string | null>(null);

  const backgroundImg = useRef<HTMLImageElement | null>(null);
  const leftPaddleImg = useRef<HTMLImageElement | null>(null);
  const rightPaddleImg = useRef<HTMLImageElement | null>(null);
  const ballImg = useRef<HTMLImageElement | null>(null);

  const getAssetUrl = (path: string | null) => {
    if (!path) return "";

    if (path.startsWith("http")) return path;

    if (path.startsWith("/pong")) return path;

    return `${API_URL}${path}`;
  };

  useEffect(() => {
    if (!theme) return;

    backgroundImg.current = new Image();
    leftPaddleImg.current = new Image();
    rightPaddleImg.current = new Image();
    ballImg.current = new Image();

    backgroundImg.current.onload = () => {
      backgroundImg.current = backgroundImg.current;
    };

    backgroundImg.current.src = getAssetUrl(
      theme.backgroundImageUrl ?? gameThemes.classic.background
    );

    leftPaddleImg.current.src = getAssetUrl(
      theme.leftPaddleImageUrl ?? gameThemes.classic.leftPaddle
    );

    rightPaddleImg.current.src = getAssetUrl(
      theme.rightPaddleImageUrl ?? gameThemes.classic.rightPaddle
    );

    ballImg.current.src = getAssetUrl(
      theme.ballImageUrl ?? gameThemes.classic.ball
    );
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const width = pongConfig.canvasWidth;
    const height = pongConfig.canvasHeight;

    const handleMatchFound = ({ room }: { room: string }) => {
      roomRef.current = room;
    };

    const handleGameState = (state: GameStateSend) => {
      gameState.current = state;
    };

    socket.on("match_found", handleMatchFound);

    socket.on("game_state", handleGameState);

    const draw = () => {
      const state = gameState.current;

      if (!state) return;

      ctx.clearRect(0, 0, width, height);

      if (backgroundImg.current && backgroundImg.current.complete) {
        ctx.drawImage(backgroundImg.current, 0, 0, width, height);
      } else {
        ctx.fillStyle = "#111827";

        ctx.fillRect(0, 0, width, height);
      }

      if (leftPaddleImg.current && leftPaddleImg.current.complete) {
        ctx.drawImage(
          leftPaddleImg.current,
          pongConfig.leftPaddleOffset,
          state.paddles.left,
          pongConfig.paddleWidth,
          state.dynamicConfig.paddleHeights.left
        );
      }

      if (rightPaddleImg.current && rightPaddleImg.current.complete) {
        ctx.drawImage(
          rightPaddleImg.current,
          width - pongConfig.rightPaddleOffset - pongConfig.paddleWidth,
          state.paddles.right,
          pongConfig.paddleWidth,
          state.dynamicConfig.paddleHeights.right
        );
      }

      if (ballImg.current && ballImg.current.complete) {
        const size = state.dynamicConfig.ballSize;

        ctx.drawImage(
          ballImg.current,
          state.ball.x - size,
          state.ball.y - size,
          size * 2,
          size * 2
        );
      }

      /*
  Score
*/
      ctx.fillStyle = "white";
      ctx.font = "48px monospace";
      ctx.textAlign = "center";

      ctx.fillText(String(state.scores.left), width / 4, 60);

      ctx.fillText(String(state.scores.right), (width * 3) / 4, 60);

      /*
        Match countdown
      */
      if (state.countdownEndsAt) {
        const remaining = Math.ceil(
          (state.countdownEndsAt - Date.now()) / 1000
        );

        ctx.fillStyle = "white";
        ctx.font = "80px monospace";

        if (remaining > 0) {
          ctx.fillText(String(remaining), width / 2, height / 2);
        } else if (remaining === 0) {
          ctx.fillText("GO!", width / 2, height / 2);
        }
      }
    };

    let animationFrame: number;

    const renderLoop = () => {
      draw();

      animationFrame = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animationFrame);

      socket.off("match_found", handleMatchFound);

      socket.off("game_state", handleGameState);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!roomRef.current) return;

      if (event.key === "w" || event.key === "ArrowUp") {
        socket.emit("paddle_move", {
          room: roomRef.current,
          direction: "up",
        });
      }

      if (event.key === "s" || event.key === "ArrowDown") {
        socket.emit("paddle_move", {
          room: roomRef.current,
          direction: "down",
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (touchTimer.current) clearInterval(touchTimer.current);
    };
  }, []);

  const moveTowardTouch = () => {
    const state = gameState.current;
    const target = touchTargetY.current;

    if (!roomRef.current || !state || target === null) return;

    const paddleCenter =
      state.paddles[playerSide] +
      state.dynamicConfig.paddleHeights[playerSide] / 2;

    // dead zone of about one step so the paddle doesn't jitter in place
    const deadZone = pongConfig.paddleSpeed / 2;

    if (Math.abs(target - paddleCenter) <= deadZone) return;

    socket.emit("paddle_move", {
      room: roomRef.current,
      direction: target < paddleCenter ? "up" : "down",
    });
  };

  const updateTouchTarget = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    touchTargetY.current =
      ((e.clientY - rect.top) / rect.height) * pongConfig.canvasHeight;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // mouse players use the keyboard; only touch/pen steer by pointer
    if (e.pointerType === "mouse") return;

    e.currentTarget.setPointerCapture(e.pointerId);
    updateTouchTarget(e);
    moveTowardTouch();

    if (!touchTimer.current) {
      touchTimer.current = setInterval(moveTowardTouch, TOUCH_MOVE_INTERVAL_MS);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (touchTargetY.current === null) return;

    updateTouchTarget(e);
  };

  const handlePointerEnd = () => {
    touchTargetY.current = null;

    if (touchTimer.current) {
      clearInterval(touchTimer.current);
      touchTimer.current = null;
    }
  };

  return (
    <div
      className="relative aspect-4/3 w-full touch-none overflow-hidden border-4 border-xp-game-border bg-xp-game-bg select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
    >
      <canvas
        className="block size-full"
        ref={canvasRef}
        width={pongConfig.canvasWidth}
        height={pongConfig.canvasHeight}
      />

      <PowerUpIncoming powerUp={pendingPowerUp} />
    </div>
  );
}
