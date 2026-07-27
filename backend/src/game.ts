import { Server } from "socket.io";
import { GameConfig, GameState, pongConfig } from "./gameState";
import { PrismaClient, MatchStatus } from "../generated/prisma/client";

const prisma = new PrismaClient();

interface FullGameState extends GameState {
  config: GameConfig;
  socketToUser: Map<string, number>;
}

export const games: Record<string, FullGameState> = {};
export const gameIntervals: Record<string, NodeJS.Timeout> = {};
export const disconnectTimers: Record<string, NodeJS.Timeout> = {};

const DISCONNECT_GRACE_MS = 15000;

function runGameLoop(io: Server, room: string) {
  gameIntervals[room] = setInterval(() => {
    if (!games[room]) {
      clearInterval(gameIntervals[room]);
      delete gameIntervals[room];
      return;
    }
    updateGame(io, room);
    if (!games[room]) return; // check again after updateGame deletes it
    const { config: _, ...stateToSend } = games[room]!;
    io.to(room).emit("game_state", stateToSend);
  }, 1000 / 60);
}

export function startGame(
  io: Server,
  room: string,
  player1Id: string,
  player2Id: string,
  socketToUser: Map<string, number>,
  config: GameConfig = pongConfig,
) {
  games[room] = {
    ball: {
      x: config.canvasWidth / 2,
      y: config.canvasHeight / 2,
      vx: config.ballSpeed * (Math.random() > 0.5 ? 1 : -1),
      vy: config.ballSpeed * (Math.random() > 0.5 ? 1 : -1),
    },
    paddles: {
      left: config.canvasHeight / 2 - config.paddleHeight / 2,
      right: config.canvasHeight / 2 - config.paddleHeight / 2,
    },
    scores: { left: 0, right: 0 },
    players: { left: player1Id, right: player2Id },
    config,
    socketToUser,
  };

  runGameLoop(io, room);
}

export function findRoomBySocket(socketId: string): string | null {
  for (const [room, game] of Object.entries(games)) {
    if (game.players.left === socketId || game.players.right === socketId) {
      return room;
    }
  }
  return null;
}

// Pauses the loop (without deleting game state) so a briefly dropped
// connection doesn't instantly end the match.
export function pauseGame(room: string) {
  clearInterval(gameIntervals[room]);
  delete gameIntervals[room];
}

export function resumeGame(io: Server, room: string) {
  if (games[room] && !gameIntervals[room]) {
    runGameLoop(io, room);
  }
}

export function scheduleGameCleanup(
  io: Server,
  room: string,
  disconnectedSocketId: string,
) {
  disconnectTimers[room] = setTimeout(() => {
    delete disconnectTimers[room];
    const game = games[room];
    if (game) {
      const winner =
        game.players.left === disconnectedSocketId
          ? game.players.right
          : game.players.left;
      io.to(room).emit("game_over", {
        winner,
        scores: game.scores,
        reason: "disconnect",
      });
    }
    delete games[room];
    delete gameIntervals[room];
  }, DISCONNECT_GRACE_MS);
}

export function cancelGameCleanup(room: string) {
  if (disconnectTimers[room]) {
    clearTimeout(disconnectTimers[room]);
    delete disconnectTimers[room];
  }
}

export function handlePaddleMove(
  socketId: string,
  room: string,
  direction: "up" | "down",
) {
  const game = games[room];
  if (!game) return;

  const { config } = game;
  const side = game.players.left === socketId ? "left" : "right";

  if (direction === "up") {
    game.paddles[side] = Math.max(0, game.paddles[side] - config.paddleSpeed);
  } else {
    game.paddles[side] = Math.min(
      config.canvasHeight - config.paddleHeight,
      game.paddles[side] + config.paddleSpeed,
    );
  }
}

async function updateGame(io: Server, room: string) {
  const game = games[room];
  if (!game) return;

  const { config, socketToUser } = game;
  const ball = game.ball;

  ball.x += ball.vx;
  ball.y += ball.vy;

  // Top/bottom wall collision
  if (ball.y <= 0 || ball.y >= config.canvasHeight - config.ballSize) {
    ball.vy *= -1;
  }

  // Left paddle collision
  if (
    ball.x <= config.paddleWidth &&
    ball.y >= game.paddles.left &&
    ball.y <= game.paddles.left + config.paddleHeight
  ) {
    ball.vx *= -1;
    ball.x = config.paddleWidth;
  }

  // Right paddle collision
  if (
    ball.x >= config.canvasWidth - config.paddleWidth - config.ballSize &&
    ball.y >= game.paddles.right &&
    ball.y <= game.paddles.right + config.paddleHeight
  ) {
    ball.vx *= -1;
    ball.x = config.canvasWidth - config.paddleWidth - config.ballSize;
  }

  // Left player misses → right scores
  if (ball.x <= 0) {
    game.scores.right++;
    resetBall(game);
  }

  // Right player misses → left scores
  if (ball.x >= config.canvasWidth) {
    game.scores.left++;
    resetBall(game);
  }

  // Win condition
  if (
    game.scores.left >= config.winningScore ||
    game.scores.right >= config.winningScore
  ) {
    const winnerSocketId =
      game.scores.left >= config.winningScore
        ? game.players.left
        : game.players.right;

    const p1UserId = socketToUser.get(game.players.left);
    const p2UserId = socketToUser.get(game.players.right);
    const winnerUserId = socketToUser.get(winnerSocketId);
    let winnerUsername = "Unknown";

    if (p1UserId && p2UserId) {
      await prisma.match.create({
        data: {
          player1Id: p1UserId,
          player2Id: p2UserId,
          winnerId: winnerUserId ?? null,
          player1Score: game.scores.left,
          player2Score: game.scores.right,
          status: MatchStatus.finished,
        },
      });

      console.log("winneruserid is: ", winnerUserId);
      // fetch winner username only if we have their userId
      if (winnerUserId) {
        const winner = await prisma.user.findUnique({
          where: { id: winnerUserId },
          select: { id: true, username: true },
        });
        winnerUsername = winner?.username ?? "Unknown";
      }
    }

    io.to(room).emit("game_over", {
      winnerSocketId,
      winnerId: winnerUserId,
      winnerUsername,
      scores: game.scores,
    });

    clearInterval(gameIntervals[room]);
    delete gameIntervals[room];
    delete games[room];
  }
}

function resetBall(game: FullGameState) {
  const { config } = game;
  game.ball = {
    x: config.canvasWidth / 2,
    y: config.canvasHeight / 2,
    vx: config.ballSpeed * (Math.random() > 0.5 ? 1 : -1),
    vy: config.ballSpeed * (Math.random() > 0.5 ? 1 : -1),
  };
}
