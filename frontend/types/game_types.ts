// The backend imports this file so dont use imports here or backend build will break

// dynamic values that change during gameplay (sent to frontend)
export interface GameStateSend {
  ball: { x: number; y: number; vx: number; vy: number };
  paddles: { left: number; right: number };
  scores: { left: number; right: number };
  players: { left: string; right: string };
  countdownEndsAt: number | null; // pre-match countdown, ball is held until this passes
  pendingPowerUp: PendingPowerUp | null;
  activeEffects: {
    left: { type: PowerUpType; expiresAt: number } | null;
    right: { type: PowerUpType; expiresAt: number } | null;
  };
  dynamicConfig: {  // dynamic bcuz it can change due to powerups
    paddleHeights: { left: number; right: number };
    ballSize: number;
  };
}

// full internal game state (backend only)
export interface FullGameState {
  ball: { x: number; y: number; vx: number; vy: number };
  paddles: { left: number; right: number };
  scores: { left: number; right: number };
  players: { left: string; right: string };
  countdownEndsAt: number | null; // pre-match countdown, ball is held until this passes
  pendingPowerUp: PendingPowerUp | null;
  activeEffects: {
    left: { type: PowerUpType; expiresAt: number } | null;
    right: { type: PowerUpType; expiresAt: number } | null;
  };
  config: GameConfig; // original config, never changes
  paddleHeights: { left: number; right: number }; // dynamic, defaults to config.paddleHeight per side
  paddleSpeeds: { left: number; right: number }; // dynamic, defaults to config.paddleSpeed per side
  ballSize: number; // dynamic, defaults to config.ballSize
  socketToUser: Map<string, number>;
  isEnding: boolean;
  // fetched once at match start (during the countdown) so the game_over emit
  // this can send the usernames to the frontend without needing to query the database again
  usernamesPromise: Promise<{ left: string; right: string }>;
}

export interface GameConfig {
  canvasWidth: number;
  canvasHeight: number;
  paddleHeight: number;
  paddleWidth: number;
  leftPaddleOffset: number;
  rightPaddleOffset: number;
  ballSize: number;
  paddleSpeed: number;
  ballSpeed: number;
  winningScore: number;
  gameName: "pong";
}

// default config for pong game (backend and frontend should use the same values)
export const pongConfig: GameConfig = {
  canvasWidth: 800,
  canvasHeight: 600,
  paddleHeight: 100,
  paddleWidth: 16,
  leftPaddleOffset: 20,
  rightPaddleOffset: 20,
  ballSize: 10,
  paddleSpeed: 15,
  ballSpeed: 4,
  winningScore: 5,
  gameName: "pong",
};

// max scores a player can pick when inviting a friend (random matchmaking always uses the default)
export const WINNING_SCORE_OPTIONS = [3, 5, 7, 11] as const;

export function isValidWinningScore(value: unknown): value is number {
  return (WINNING_SCORE_OPTIONS as readonly unknown[]).includes(value);
}

export type PowerUpType =
  | "bigPaddle"
  | "smallPaddle"
  | "freeze"
  | "smallBall"
  | "paddleSpeedBoost";

// a power-up that has been announced and will auto-activate at applyAt
// the server will send this to the frontend so it can display a warning
export interface PendingPowerUp {
  type: PowerUpType;
  side: "left" | "right";
  applyAt: number;
}