"use client";

import { useEffect, useRef } from "react";
import { socket } from "../../../lib/socket";
import "./GameCanvas.scss";
// use this to get the types for GameState/GameConfig/PowerUp from shared folder
import { GameStateSend, GameConfig, PowerUp } from "../../../../shared/game_types";

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameState = useRef<GameStateSend | null>(null); // null until first game_state arrives
  const roomRef = useRef<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // change in backend/gameState if u want
    const width = canvas.width;   // 800
    const height = canvas.height; // 600

    socket.on("match_found", ({ room }: { room: string }) => {
      roomRef.current = room;
    });

    socket.on("game_state", (state: GameStateSend) => {
      gameState.current = state;
    });

    const draw = () => {
      const state = gameState.current;
      if (!state) return; // wait for first game_state from backend

      ctx.clearRect(0, 0, width, height);

      // Background
      ctx.fillStyle = "#111827";
      ctx.fillRect(0, 0, width, height);

      // Center line
      ctx.fillStyle = "#475569";
      for (let i = 0; i < height; i += 30) {
        ctx.fillRect(width / 2 - 2, i, 4, 20);
      }

      // Paddles
      ctx.fillStyle = "white";
      ctx.fillRect(20, state.paddles.left, 16, 100);
      ctx.fillRect(width - 36, state.paddles.right, 16, 100);

      // Ball
      ctx.beginPath();
      ctx.fillStyle = "white";
      ctx.arc(state.ball.x, state.ball.y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();

      // Scores
      ctx.fillStyle = "white";
      ctx.font = "48px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`${state.scores.left}`, width / 4, 60);
      ctx.fillText(`${state.scores.right}`, (width * 3) / 4, 60);
    };

    const renderLoop = () => {
      draw();
      requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      socket.off("game_state");
      socket.off("match_found");
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!roomRef.current) return;

      if (event.key === "w" || event.key === "ArrowUp")
        socket.emit("paddle_move", { room: roomRef.current, direction: "up" });
      if (event.key === "s" || event.key === "ArrowDown")
        socket.emit("paddle_move", { room: roomRef.current, direction: "down" });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="canvas-wrapper">
      <canvas ref={canvasRef} width={800} height={600} />
    </div>
  );
}