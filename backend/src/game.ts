import { Server } from "socket.io";
import {
  GameConfig,
  GameStateSend,
  FullGameState,
  pongConfig,
  PowerUpType,
} from "../../shared/game_types";
import prisma from "../src/prisma";

export const games: Record<string, FullGameState> = {};
export const gameIntervals: Record<string, NodeJS.Timeout> = {};
export const disconnectTimers: Record<string, NodeJS.Timeout> = {};
export const powerUpTimers: Record<string, NodeJS.Timeout> = {};

const DISCONNECT_GRACE_MS = 15000; // time left to reconnect before the match ends
const MATCH_COUNTDOWN_MS = 3000; // pre-match countdown before the ball starts moving
const BALL_SPEEDUP_FACTOR = 1.05; // +5% speed per paddle hit
const BALL_MAX_SPEED_MULTIPLIER = 2.5; // max speed is 2.5x the original speed

// scales the ball's velocity by `factor` while keeping direction, capped so
// consecutive paddle hits / speed boosts can't push it past a playable speed
function scaleBallSpeed(game: FullGameState, factor: number) {
  const { ball, config } = game;
  const maxSpeed = config.ballSpeed * BALL_MAX_SPEED_MULTIPLIER;
  const currentSpeed = Math.hypot(ball.vx, ball.vy);
  const targetSpeed = Math.min(currentSpeed * factor, maxSpeed);
  const scale = targetSpeed / currentSpeed;
  ball.vx *= scale;
  ball.vy *= scale;
}

function applyPowerUp(
  game: FullGameState,
  side: "left" | "right",
  type: PowerUpType,
  io: Server,
  room: string,
) {
  const opponent = side === "left" ? "right" : "left";
  const expiresAt = Date.now() + 5000; // 5 seconds
  const { config } = game;

  // "freeze"/"smallPaddle" are debuffs aimed at the opponent; everything else
  // is a self-buff for the collector — this also decides which activeEffects
  // slot (and cooldown label) the effect shows up under
  const affected =
    type === "freeze" || type === "smallPaddle" ? opponent : side;

  switch (type) {
    case "bigPaddle":
      game.paddleHeights[side] = config.paddleHeight * 2;
      break;

    case "smallPaddle":
      game.paddleHeights[opponent] = config.paddleHeight / 2;
      break;

    case "freeze":
      break;

    case "smallBall":
      game.ballSize = config.ballSize / 2;
      break;

    case "paddleSpeedBoost":
      game.paddleSpeeds[side] = config.paddleSpeed * 1.5;
      break;
  }

  game.activeEffects[affected] = { type, expiresAt };

  // reset effect after duration
  setTimeout(() => {
    if (!games[room]) return;

    switch (type) {
      case "bigPaddle":
        game.paddleHeights[side] = config.paddleHeight;
        break;
      case "smallPaddle":
        game.paddleHeights[opponent] = config.paddleHeight;
        break;
      case "smallBall":
        game.ballSize = config.ballSize;
        break;
      case "paddleSpeedBoost":
        game.paddleSpeeds[side] = config.paddleSpeed;
        break;
    }

    game.activeEffects[affected] = null;
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
      countdownEndsAt: game.countdownEndsAt,
      pendingPowerUp: game.pendingPowerUp,
      activeEffects: game.activeEffects,
      dynamicConfig: {
        paddleHeights: game.paddleHeights,
        ballSize: game.ballSize,
      },
    };
    io.to(room).emit("game_state", stateToSend);
  }, 1000 / 60);
}

async function fetchUsernames(
  socketToUser: Map<string, number>,
  player1Id: string,
  player2Id: string,
): Promise<{ left: string; right: string }> {
  const p1UserId = socketToUser.get(player1Id);
  const p2UserId = socketToUser.get(player2Id);
  const ids = [p1UserId, p2UserId].filter(
    (id): id is number => id !== undefined,
  );
  if (ids.length === 0) return { left: "Unknown", right: "Unknown" };

  try {
    const users = await prisma.user.findMany({
      where: { id: { in: ids } },
      select: { id: true, username: true },
    });
    const byId = new Map(users.map((u) => [u.id, u.username]));
    return {
      left: (p1UserId !== undefined && byId.get(p1UserId)) || "Unknown",
      right: (p2UserId !== undefined && byId.get(p2UserId)) || "Unknown",
    };
  } catch (err) {
    console.error("Failed to prefetch usernames:", err);
    return { left: "Unknown", right: "Unknown" };
  }
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
    paddleHeights: { left: config.paddleHeight, right: config.paddleHeight },
    paddleSpeeds: { left: config.paddleSpeed, right: config.paddleSpeed },
    ballSize: config.ballSize,
    socketToUser,
    isEnding: false,
    usernamesPromise: fetchUsernames(socketToUser, player1Id, player2Id),
    countdownEndsAt: Date.now() + MATCH_COUNTDOWN_MS,
    pendingPowerUp: null,
    activeEffects: {
      left: null,
      right: null,
    },
  };

  setTimeout(() => scheduleNextPowerUp(io, room), MATCH_COUNTDOWN_MS);
  runGameLoop(io, room);
}

const POWER_UP_TYPES: PowerUpType[] = [
  "bigPaddle",
  "smallPaddle",
  "freeze",
  "smallBall",
  "paddleSpeedBoost",
];
const POWER_UP_MIN_DELAY_MS = 10000;
const POWER_UP_MAX_DELAY_MS = 15000;
const POWER_UP_WARNING_MS = 2000; // time between the announcement and it taking effect

function scheduleNextPowerUp(io: Server, room: string) {
  const delay =
    POWER_UP_MIN_DELAY_MS +
    Math.random() * (POWER_UP_MAX_DELAY_MS - POWER_UP_MIN_DELAY_MS);

  powerUpTimers[room] = setTimeout(() => {
    const game = games[room];
    if (!game) return;

    const type =
      POWER_UP_TYPES[Math.floor(Math.random() * POWER_UP_TYPES.length)]!;
    const side: "left" | "right" = Math.random() < 0.5 ? "left" : "right";
    const applyAt = Date.now() + POWER_UP_WARNING_MS;

    game.pendingPowerUp = { type, side, applyAt };
    io.to(room).emit("power_up_incoming", game.pendingPowerUp);

    setTimeout(() => {
      const game = games[room];
      if (!game) return;
      game.pendingPowerUp = null;
      applyPowerUp(game, side, type, io, room);
      io.to(room).emit("power_up_activated", { type, side });
    }, POWER_UP_WARNING_MS);

    scheduleNextPowerUp(io, room);
  }, delay);
}

// finds the room that a given socket is currently in, or null if not in any
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

// handles a player disconnecting, giving them some time to reconnect before ending the match
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
  const speed = game.paddleSpeeds[side];
  if (direction === "up") {
    game.paddles[side] = Math.max(0, game.paddles[side] - speed);
  } else {
    game.paddles[side] = Math.min(
      config.canvasHeight - game.paddleHeights[side],
      game.paddles[side] + speed,
    );
  }
}

async function updateGame(io: Server, room: string) {
  const game = games[room];
  if (!game) return;

  // hold the ball still during the pre-match countdown
  if (game.countdownEndsAt && Date.now() < game.countdownEndsAt) return;

  const { config, socketToUser } = game;
  const ball = game.ball;

  ball.x += ball.vx;
  ball.y += ball.vy;

  // Top/bottom wall collision
  if (ball.y <= 0 || ball.y >= config.canvasHeight - game.ballSize) {
    ball.vy *= -1;
  }

  // Left paddle collision
  if (
    ball.x <= config.leftPaddleOffset + config.paddleWidth &&
    ball.y >= game.paddles.left &&
    ball.y <= game.paddles.left + game.paddleHeights.left
  ) {
    ball.vx *= -1;
    ball.x = config.leftPaddleOffset + config.paddleWidth;
    scaleBallSpeed(game, BALL_SPEEDUP_FACTOR);
  }

  // Right paddle collision
  if (
    ball.x >=
      config.canvasWidth -
        config.rightPaddleOffset -
        config.paddleWidth -
        game.ballSize &&
    ball.y >= game.paddles.right &&
    ball.y <= game.paddles.right + game.paddleHeights.right
  ) {
    ball.vx *= -1;
    ball.x =
      config.canvasWidth -
      config.rightPaddleOffset -
      config.paddleWidth -
      game.ballSize;
    scaleBallSpeed(game, BALL_SPEEDUP_FACTOR);
  }

  // Left player misses → right scores
  if (ball.x <= 0) {
    game.scores.right++;
    resetBall(game, "right"); // right scored, send ball toward left
  }

  // Right player misses → left scores
  if (ball.x >= config.canvasWidth) {
    game.scores.left++;
    resetBall(game, "left"); // left scored, send ball toward right
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
    clearTimeout(powerUpTimers[room]);
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

    // prefetched during the pre-match countdown, so this resolves instantly
    const usernames = await game.usernamesPromise;
    const winnerUsername =
      winnerSocketId === game.players.left ? usernames.left : usernames.right;

    if (p1UserId && p2UserId) {
      // fire-and-forget: persist the match without blocking the game_over emit
      prisma.match
        .create({
          data: {
            player1Id: p1UserId,
            player2Id: p2UserId,
            winnerId: winnerUserId ?? null,
            player1Score: game.scores.left,
            player2Score: game.scores.right,
          },
        })
        .catch((err) => console.error("Failed to save match:", err));
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

function resetBall(game: FullGameState, lastScorer: "left" | "right") {
  const { config } = game;
  const direction = lastScorer === "left" ? -1 : 1; // send toward loser
  game.ball = {
    x: config.canvasWidth / 2,
    y: config.canvasHeight / 2,
    vx: config.ballSpeed * direction,
    vy: config.ballSpeed * (Math.random() > 0.5 ? 1 : -1),
  };
}
