"use client";

import { useEffect, useRef } from "react";

import { socket } from "../../../lib/socket";
import "./GameCanvas.scss";

import { GameStateSend, pongConfig } from "@/types/game_types";
import { gameThemes } from "@/app/data/game/gameCustomization";

import {
  customizationService,
  CustomizationTheme,
} from "@/services/Customization.services";



export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const gameState = useRef<GameStateSend | null>(null);
  const roomRef = useRef<string | null>(null);

  const theme = useRef<CustomizationTheme | null>(null);

  const backgroundImg = useRef<HTMLImageElement | null>(null);
  const leftPaddleImg = useRef<HTMLImageElement | null>(null);
  const rightPaddleImg = useRef<HTMLImageElement | null>(null);
  const ballImg = useRef<HTMLImageElement | null>(null);

  const getAssetUrl = (path: string | null) => {
    if (!path)
      return "";

    if (path.startsWith("http"))
      return path;

    if (path.startsWith("/pong"))
      return path;

    return `http://localhost:3001${path}`;
  };

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const userTheme =
          await customizationService.getMyTheme();

        theme.current = userTheme;

        backgroundImg.current = new Image();
        leftPaddleImg.current = new Image();
        rightPaddleImg.current = new Image();
        ballImg.current = new Image();

        backgroundImg.current.src =
          getAssetUrl(
            userTheme.backgroundImageUrl ??
            gameThemes.classic.background
          );

        leftPaddleImg.current.src =
          getAssetUrl(
            userTheme.leftPaddleImageUrl ??
            gameThemes.classic.leftPaddle
          );

        rightPaddleImg.current.src =
          getAssetUrl(
            userTheme.rightPaddleImageUrl ??
            gameThemes.classic.rightPaddle
          );

        ballImg.current.src =
          getAssetUrl(
            userTheme.ballImageUrl ??
            gameThemes.classic.ball
          );

      } catch (error) {
        console.error(
          "Failed to load game customization",
          error
        );
      }
    };

    loadTheme();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas)
      return;

    const ctx = canvas.getContext("2d");

    if (!ctx)
      return;

    const width = pongConfig.canvasWidth;
    const height = pongConfig.canvasHeight;

    const handleMatchFound = ({
      room,
    }: {
      room: string;
    }) => {
      roomRef.current = room;
    };

    const handleGameState = (
      state: GameStateSend
    ) => {
      gameState.current = state;
    };

    socket.on(
      "match_found",
      handleMatchFound
    );

    socket.on(
      "game_state",
      handleGameState
    );

    const draw = () => {
      const state = gameState.current;

      if (!state)
        return;

      ctx.clearRect(
        0,
        0,
        width,
        height
      );

      if (
        backgroundImg.current &&
        backgroundImg.current.complete
      ) {
        ctx.drawImage(
          backgroundImg.current,
          0,
          0,
          width,
          height
        );
      } else {
        ctx.fillStyle = "#111827";

        ctx.fillRect(
          0,
          0,
          width,
          height
        );
      }

      if (
        leftPaddleImg.current &&
        leftPaddleImg.current.complete
      ) {
        ctx.drawImage(
          leftPaddleImg.current,
          pongConfig.leftPaddleOffset,
          state.paddles.left,
          pongConfig.paddleWidth,
          state.dynamicConfig.paddleHeights.left
        );
      }

      if (
        rightPaddleImg.current &&
        rightPaddleImg.current.complete
      ) {
        ctx.drawImage(
          rightPaddleImg.current,
          width -
          pongConfig.rightPaddleOffset -
          pongConfig.paddleWidth,
          state.paddles.right,
          pongConfig.paddleWidth,
          state.dynamicConfig.paddleHeights.right
        );
      }

      if (
        ballImg.current &&
        ballImg.current.complete
      ) {
        const size =
          state.dynamicConfig.ballSize;

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

ctx.fillText(
  String(state.scores.left),
  width / 4,
  60
);

ctx.fillText(
  String(state.scores.right),
  (width * 3) / 4,
  60
);


/*
  Power Up Incoming
*/
if (state.pendingPowerUp) {
  const remaining = Math.ceil(
    (state.pendingPowerUp.applyAt - Date.now()) / 1000
  );

  if (remaining > 0) {
    ctx.fillStyle = "yellow";
    ctx.font = "22px monospace";

    ctx.fillText(
      `${state.pendingPowerUp.type} in ${remaining}`,
      width / 2,
      60
    );
  }
}

    

      /*
        Match countdown
      */
      if (state.countdownEndsAt) {
        const remaining =
          Math.ceil(
            (
              state.countdownEndsAt -
              Date.now()
            ) / 1000
          );

        ctx.fillStyle = "white";
        ctx.font = "80px monospace";

        if (remaining > 0) {
          ctx.fillText(
            String(remaining),
            width / 2,
            height / 2
          );
        } else if (remaining === 0) {
          ctx.fillText(
            "GO!",
            width / 2,
            height / 2
          );
        }
      }
    };

    let animationFrame: number;

    const renderLoop = () => {
      draw();

      animationFrame =
        requestAnimationFrame(
          renderLoop
        );
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(
        animationFrame
      );

      socket.off(
        "match_found",
        handleMatchFound
      );

      socket.off(
        "game_state",
        handleGameState
      );
    };

  });

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (!roomRef.current)
        return;

      if (
        event.key === "w" ||
        event.key === "ArrowUp"
      ) {
        socket.emit(
          "paddle_move",
          {
            room: roomRef.current,
            direction: "up",
          }
        );
      }

      if (
        event.key === "s" ||
        event.key === "ArrowDown"
      ) {
        socket.emit(
          "paddle_move",
          {
            room: roomRef.current,
            direction: "down",
          }
        );
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };

  }, []);

  return (
    <div className="canvas-wrapper">
      <canvas
        ref={canvasRef}
        width={pongConfig.canvasWidth}
        height={pongConfig.canvasHeight}
      />
    </div>
  );
}