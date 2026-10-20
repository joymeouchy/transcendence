import { Server } from "socket.io";
import {
  GameConfig,
  GameStateSend,
  FullGameState,
  pongConfig,
  PowerUpType,
} from "../../frontend/types/game_types";
import prisma from "../src/prisma";

// room → full game state (ball, paddles, scores, players, power-ups)
export const games: Record<string, FullGameState> = {};
// room → the 60 fps loop timer. no entry means the game is paused
export const gameIntervals: Record<string, NodeJS.Timeout> = {};
// room → the timer that ends the match if a disconnected player doesn't come back
export const disconnectTimers: Record<string, NodeJS.Timeout> = {};
// room → the timer for the next power-up
export const powerUpTimers: Record<string, NodeJS.Timeout> = {};

const DISCONNECT_GRACE_MS = 15000; // time left to reconnect before the match ends
const MATCH_COUNTDOWN_MS = 3000; // pre-match countdown before the ball starts moving
const BALL_SPEEDUP_FACTOR = 1.05; // +5% speed per paddle hit
const BALL_MAX_SPEED_MULTIPLIER = 2.5; // max speed is 2.5x the original speed
const POWER_UP_DURATION_MS = 5000; // how long a power-up stays active
const FREEZE_DURATION_MS = 3000; // freeze is the exception

// scales the ball's velocity by `factor` while keeping direction, capped so
// consecutive paddle hits can't push it past a playable speed
function scaleBallSpeed(game: FullGameState, factor: number) {
  const { ball, config } = game;
  const maxSpeed = config.ballSpeed * BALL_MAX_SPEED_MULTIPLIER;
  // vx/vy are the horizontal/vertical speeds, the real speed is the length of
  // that vector: sqrt(vx² + vy²). multiplying both by the same number changes
  // the speed but not the direction
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
  // freeze is shorter than the rest to keep it fair
  const duration =
    type === "freeze" ? FREEZE_DURATION_MS : POWER_UP_DURATION_MS;
  const expiresAt = Date.now() + duration;
  const { config } = game;

  // "freeze"/"smallPaddle" are debuffs aimed at the opponent,
  // everything else is a self-buff for the chosen side.
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

  // reset effect after duration, back to the normal values from config
  setTimeout(() => {
    if (!games[room]) return; // the match already ended

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
  }, duration);
}

// the game loop: runs 60 times per second. Each tick moves the game one
// step forward, then sends the new state to both players in the room
function runGameLoop(io: Server, room: string) {
  gameIntervals[room] = setInterval(() => {
    if (!games[room]) {
      clearInterval(gameIntervals[room]);
      delete gameIntervals[room];
      return;
    }
    updateGame(io, room);
    if (!games[room]) return; // check again after updateGame deletes it

    // send the new state to both players. the frontend uses this to draw the game
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

// loads both players' usernames from the DB when the match starts, so the
// game_over message doesn't have to wait for a DB query at the end.
// falls back to "Unknown" if a user can't be found or the query fails
async function fetchUsernames(
  socketToUser: Map<string, number>,
  player1Id: string,
  player2Id: string,
): Promise<{ left: string; right: string }> {
  const p1UserId = socketToUser.get(player1Id);
  const p2UserId = socketToUser.get(player2Id);
  // drop missing ids
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
    // ball starts in the center, going diagonally in a random direction
    ball: {
      x: config.canvasWidth / 2,
      y: config.canvasHeight / 2,
      vx: config.ballSpeed * (Math.random() > 0.5 ? 1 : -1),
      vy: config.ballSpeed * (Math.random() > 0.5 ? 1 : -1),
    },
    // paddle positions are their top edge, so this centers them vertically
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

  // power-ups only start once the countdown is over
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

// power-up cycle: wait a random 10 to 15s, pick a random power-up and side,
// announce it (power_up_incoming), and apply it 2s later (power_up_activated).
// every cycle schedules the next one, so power-ups keep coming until the match ends
function scheduleNextPowerUp(io: Server, room: string) {
  const delay =
    POWER_UP_MIN_DELAY_MS +
    Math.random() * (POWER_UP_MAX_DELAY_MS - POWER_UP_MIN_DELAY_MS);

  powerUpTimers[room] = setTimeout(() => {
    const game = games[room];
    if (!game) return;

    // paused on a disconnect: skip this power-up and try again later
    if (!gameIntervals[room]) {
      scheduleNextPowerUp(io, room);
      return;
    }

    const type =
      POWER_UP_TYPES[Math.floor(Math.random() * POWER_UP_TYPES.length)]!;
    const side: "left" | "right" = Math.random() < 0.5 ? "left" : "right";
    const applyAt = Date.now() + POWER_UP_WARNING_MS;

    game.pendingPowerUp = { type, side, applyAt };
    io.to(room).emit("power_up_incoming", game.pendingPowerUp);

    const activate = () => {
      const game = games[room];
      if (!game) return;
      // paused on a disconnect after it was announced: hold it until the match resumes
      if (!gameIntervals[room]) {
        setTimeout(activate, POWER_UP_WARNING_MS);
        return;
      }
      game.pendingPowerUp = null;
      applyPowerUp(game, side, type, io, room);
      io.to(room).emit("power_up_activated", { type, side });
    };
    setTimeout(activate, POWER_UP_WARNING_MS);

    scheduleNextPowerUp(io, room);
  }, delay);
}

// finds the room that a given socket is currently in, or null if not in any
export function findRoomBySocket(socketId: string): string | null {
  // Object.entries returns an array of [key, value] pairs
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

// restarts the loop after a reconnect. the state was kept,
// so the match continues exactly where it stopped
export function resumeGame(io: Server, room: string) {
  if (games[room] && !gameIntervals[room]) {
    runGameLoop(io, room);
  }
}

// handles a player disconnecting, giving them some time to reconnect before ending the match.
// if they're not back after DISCONNECT_GRACE_MS, the other player wins.
// a match ended this way is not saved to the match history
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

// the player reconnected in time: stop the timer that would end the match
export function cancelGameCleanup(room: string) {
  if (disconnectTimers[room]) {
    clearTimeout(disconnectTimers[room]);
    delete disconnectTimers[room];
  }
}

// the remaining player chose to leave while waiting for a disconnected
// opponent: drop the match now instead of declaring them the winner once the
// grace period runs out. Returns false if the room isn't in that state.
export function abandonPausedGame(room: string): boolean {
  if (!games[room] || !disconnectTimers[room]) return false;

  cancelGameCleanup(room);
  clearTimeout(powerUpTimers[room]);
  delete games[room];
  delete gameIntervals[room];
  delete powerUpTimers[room];
  return true;
}

export function handlePaddleMove(
  socketId: string,
  room: string,
  direction: "up" | "down",
) {
  const game = games[room];
  if (!game) return;

  // making sure the sender is actually one of this match's players before moving a paddle
  if (game.players.left !== socketId && game.players.right !== socketId) return;

  const { config } = game;
  const side = game.players.left === socketId ? "left" : "right";
  // check if frozen
  const effect = game.activeEffects[side];
  if (effect?.type === "freeze" && Date.now() < effect.expiresAt) {
    return; // ignore paddle movement
  }
  // move by the paddle's speed, limited so it can't leave the canvas:
  // the top can't go above 0, the bottom edge can't go below canvasHeight
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

// one tick of the game: move the ball, bounce it off walls and paddles,
// count points and check for a winner.
// async only because the end of the match awaits the usernames
async function updateGame(io: Server, room: string) {
  const game = games[room];
  if (!game) return;

  // hold the ball still during the pre-match countdown
  if (game.countdownEndsAt && Date.now() < game.countdownEndsAt) return;

  const { config, socketToUser } = game;
  const ball = game.ball;

  // move the ball by its velocity (pixels per tick)
  ball.x += ball.vx;
  ball.y += ball.vy;

  // Top/bottom wall collision: flip the vertical direction
  if (ball.y <= 0 || ball.y >= config.canvasHeight - game.ballSize) {
    ball.vy *= -1;
  }

  // Left paddle collision: the ball reached the paddle's right edge while
  // being between its top and bottom. it bounces back, is moved out to the
  // paddle's edge (so it can't get stuck inside it) and speeds up
  if (
    ball.x <= config.leftPaddleOffset + config.paddleWidth &&
    ball.y >= game.paddles.left &&
    ball.y <= game.paddles.left + game.paddleHeights.left
  ) {
    ball.vx *= -1;
    ball.x = config.leftPaddleOffset + config.paddleWidth;
    scaleBallSpeed(game, BALL_SPEEDUP_FACTOR);
    io.to(room).emit("paddle_hit", { side: "left" });
  }

  // Right paddle collision: same as the left one, mirrored
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
    io.to(room).emit("paddle_hit", { side: "right" });
  }

  // Left player misses → right scores
  if (ball.x <= 0) {
    game.scores.right++;
    resetBall(game, "right"); // right scored, send ball toward right
  }

  // Right player misses → left scores
  if (ball.x >= config.canvasWidth) {
    game.scores.left++;
    resetBall(game, "left"); // left scored, send ball toward left
  }

  // Win condition
  if (
    game.scores.left >= config.winningScore ||
    game.scores.right >= config.winningScore
  ) {
    if (game.isEnding) return; // already handling win, skip
    game.isEnding = true; // mark as ending immediately

    // stop the loop and the power-ups, and remove the match from memory
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
      // fire-and-forget: persist the match without blocking the game_over emit (no await)
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
    }

    io.to(room).emit("game_over", {
      winnerSocketId,
      winnerId: winnerUserId,
      winnerUsername,
      scores: game.scores,
    });
  }
}

// after a point: ball back to the center at the starting speed, with a random vertical direction
function resetBall(game: FullGameState, lastScorer: "left" | "right") {
  const { config } = game;
  const direction = lastScorer === "left" ? -1 : 1; // send toward the scorer
  game.ball = {
    x: config.canvasWidth / 2,
    y: config.canvasHeight / 2,
    vx: config.ballSpeed * direction,
    vy: config.ballSpeed * (Math.random() > 0.5 ? 1 : -1),
  };
}
