import { Server } from "socket.io";
import {
  GameConfig,
  GameStateSend,
  FullGameState,
  pongConfig,
  PowerUp,
} from "../../shared/game_types";
import { PrismaClient, MatchStatus } from "../generated/prisma/client";

const prisma = new PrismaClient();

export const games: Record<string, FullGameState> = {};
export const gameIntervals: Record<string, NodeJS.Timeout> = {};
export const disconnectTimers: Record<string, NodeJS.Timeout> = {};
export const powerUpTimers: Record<string, NodeJS.Timeout> = {};

const DISCONNECT_GRACE_MS = 15000;

function applyPowerUp(
  game: FullGameState,
  side: "left" | "right",
  type: PowerUp["type"],
  io: Server,
  room: string,
) {
  const opponent = side === "left" ? "right" : "left";
  const expiresAt = Date.now() + 5000; // 5 seconds

  switch (type) {
    case "bigPaddle":
      game.activeEffects[side] = { type, expiresAt };
      game.config = { ...game.config, paddleHeight: 200 }; // double size
      break;

    case "freeze":
      game.activeEffects[opponent] = { type, expiresAt };
      break;

    case "speedBoost":
      game.ball.vx *= 1.5;
      game.ball.vy *= 1.5;
      break;

    case "smallBall":
      game.activeEffects[side] = { type, expiresAt };
      game.config = { ...game.config, ballSize: 5 }; // half size
      break;
  }

  // reset effect after duration
  setTimeout(() => {
    if (!games[room]) return;
    game.activeEffects[side] = null;
    game.activeEffects[opponent] = null;
    game.config = { ...game.config, paddleHeight: 100, ballSize: 10 }; // reset
    io.to(room).emit("power_up_expired", { type, side });
  }, 5000);
}

function runGameLoop(io: Server, room: string) {
  gameIntervals[room] = setInterval(() => {
    if (!games[room]) {
      clearInterval(gameIntervals[room]);
      delete gameIntervals[room];
      return;
    }
    updateGame(io, room);
    if (!games[room]) return; // check again after updateGame deletes it

    const game = games[room]!;
    const stateToSend: GameStateSend = {
      ball: game.ball,
      paddles: game.paddles,
      scores: game.scores,
      players: game.players,
      powerUp: game.powerUp,
      activeEffects: game.activeEffects,
      dynamicConfig: {
        paddleHeight: game.config.paddleHeight,
        ballSize: game.config.ballSize,
      },
    };
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
    isEnding: false,
    powerUp: null,
    activeEffects: {
      left: null,
      right: null,
    },
  };

  powerUpTimers[room] = setInterval(() => {
    if (!games[room]) {
      clearInterval(powerUpTimers[room]);
      delete powerUpTimers[room];
      return;
    }

    games[room].powerUp = {
      x: Math.random() * (config.canvasWidth - 100) + 50,
      y: Math.random() * (config.canvasHeight - 100) + 50,
      type: ["bigPaddle", "freeze", "speedBoost", "smallBall"][
        Math.floor(Math.random() * 4)
      ] as PowerUp["type"],
      active: true,
    };

    io.to(room).emit("power_up_spawned", games[room]!.powerUp);
  }, 15000);

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
  disconnectTimers[room] = setTimeout(async () => {
    delete disconnectTimers[room];
    const game = games[room];
    if (game) {
      const winnerSocketId =
        game.players.left === disconnectedSocketId
          ? game.players.right
          : game.players.left;

      const winnerUserId = game.socketToUser.get(winnerSocketId);
      let winnerUsername = "Unknown";

      if (winnerUserId) {
        const winner = await prisma.user.findUnique({
          where: { id: winnerUserId },
          select: { username: true },
        });
        winnerUsername = winner?.username ?? "Unknown";
      }

      io.to(room).emit("game_over", {
        winnerSocketId,
        winnerId: winnerUserId,
        winnerUsername,
        scores: game.scores,
        reason: "disconnect",
      });
    }
    delete games[room];
    delete gameIntervals[room];
    delete powerUpTimers[room];
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
  // check if frozen
  const effect = game.activeEffects[side];
  if (effect?.type === "freeze" && Date.now() < effect.expiresAt) {
    return; // ignore paddle movement
  }
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
    ball.x <= config.leftPaddleOffset + config.paddleWidth &&
    ball.y >= game.paddles.left &&
    ball.y <= game.paddles.left + config.paddleHeight
  ) {
    ball.vx *= -1;
    ball.x = config.leftPaddleOffset + config.paddleWidth;
  }

  // Right paddle collision
  if (
    ball.x >=
      config.canvasWidth -
        config.rightPaddleOffset -
        config.paddleWidth -
        config.ballSize &&
    ball.y >= game.paddles.right &&
    ball.y <= game.paddles.right + config.paddleHeight
  ) {
    ball.vx *= -1;
    ball.x =
      config.canvasWidth -
      config.rightPaddleOffset -
      config.paddleWidth -
      config.ballSize;
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

  // check power up collision
  const powerUp = game.powerUp;
  if (powerUp?.active) {
    const dist = Math.hypot(ball.x - powerUp.x, ball.y - powerUp.y);
    if (dist < 20) {
      // determine which player hit it
      const side = ball.vx < 0 ? "right" : "left"; // last direction
      applyPowerUp(game, side, powerUp.type, io, room);
      game.powerUp = null;
      io.to(room).emit("power_up_collected", { type: powerUp.type, side });
    }
  }

  // Win condition
  if (
    game.scores.left >= config.winningScore ||
    game.scores.right >= config.winningScore
  ) {
    if (game.isEnding) return; // already handling win, skip
    game.isEnding = true; // mark as ending immediately

    // stop the loop
    clearInterval(gameIntervals[room]);
    clearInterval(powerUpTimers[room]);
    delete gameIntervals[room];
    delete powerUpTimers[room];
    delete games[room];

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

      if (winnerUserId) {
        const winner = await prisma.user.findUnique({
          where: { id: winnerUserId },
          select: { id: true, username: true },
        });
        winnerUsername = winner?.username ?? "Unknown";
      }
    } else {
      console.log("Missing user IDs - p1:", p1UserId, "p2:", p2UserId);
    }

    io.to(room).emit("game_over", {
      winnerSocketId,
      winnerId: winnerUserId,
      winnerUsername,
      scores: game.scores,
    });
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
