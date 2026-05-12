"use client";

import { useEffect, useRef } from "react";
import { socket } from "../../../lib/socket";

import "./GameCanvas.scss";

type GameState = {
  ballX: number;
  ballY: number;
  leftPaddleY: number;
  rightPaddleY: number;
};

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  /*
   * These refs are updated from backend socket events.
   * The frontend only renders them.
   */
  const gameState = useRef<GameState>({
    ballX: 450,
    ballY: 250,
    leftPaddleY: 200,
    rightPaddleY: 200,
  });

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas)
      return;

    const ctx = canvas.getContext("2d");

    if (!ctx)
      return;

    const width = canvas.width;
    const height = canvas.height;

    /*
     * Receive authoritative game state from backend
     */
    socket.on("game_state", (state: GameState) => {
      gameState.current = state;
    });

    /*
     * Rendering only
     */
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = "#111827";
      ctx.fillRect(0, 0, width, height);

      /*
       * Center line
       */
      ctx.fillStyle = "#475569";

      for (let i = 0; i < height; i += 30) {
        ctx.fillRect(width / 2 - 2, i, 4, 20);
      }

      const state = gameState.current;

      /*
       * Paddles
       */
      ctx.fillStyle = "white";

      ctx.fillRect(
        20,
        state.leftPaddleY,
        16,
        100
      );

      ctx.fillRect(
        width - 36,
        state.rightPaddleY,
        16,
        100
      );

      /*
       * Ball
       */
      ctx.beginPath();

      ctx.arc(
        state.ballX,
        state.ballY,
        10,
        0,
        Math.PI * 2
      );

      ctx.fill();
      ctx.closePath();
    };

    /*
     * Frontend render loop only
     */
    const renderLoop = () => {
      draw();

      requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      socket.off("game_state");
    };
  }, []);

  /*
   * Send player input to backend
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "w") {
        socket.emit("move_up");
      }

      if (event.key === "s") {
        socket.emit("move_down");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="canvas-wrapper">
      <canvas
        ref={canvasRef}
        className="game-canvas"
        width={900}
        height={500}
      />
    </div>
  );
}