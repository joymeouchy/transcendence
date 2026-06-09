import { Server } from "socket.io";
import { GameConfig, GameState, pongConfig } from "./gameState";

interface FullGameState extends GameState {
  config: GameConfig;
}

export const games: Record<string, FullGameState> = {};
export const gameIntervals: Record<string, NodeJS.Timeout> = {};

export function startGame(
  io: Server,
  room: string,
  player1Id: string,
  player2Id: string,
  config: GameConfig = pongConfig
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
  };

  gameIntervals[room] = setInterval(() => {
    if (!games[room]) {
      clearInterval(gameIntervals[room]);
      return;
    }
    updateGame(io, room);
    const { config: _, ...stateToSend } = games[room]!;
    io.to(room).emit("game_state", stateToSend);
  }, 1000 / 60);
}

export function handlePaddleMove(
  socketId: string,
  room: string,
  direction: "up" | "down"
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
      game.paddles[side] + config.paddleSpeed
    );
  }
}

function updateGame(io: Server, room: string) {
  const game = games[room];
  if (!game) return;

  const { config } = game;
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
    const winner =
      game.scores.left >= config.winningScore
        ? game.players.left
        : game.players.right;
    io.to(room).emit("game_over", { winner, scores: game.scores });
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
