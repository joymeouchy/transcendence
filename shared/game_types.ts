// dynamic values that change during gameplay (sent to frontend)
export interface GameStateSend {
  ball: { x: number; y: number; vx: number; vy: number };
  paddles: { left: number; right: number };
  scores: { left: number; right: number };
  players: { left: string; right: string };
  powerUp: PowerUp | null;
  activeEffects: {
    left: { type: string; expiresAt: number } | null;
    right: { type: string; expiresAt: number } | null;
  };
  dynamicConfig: {  // dynamic bcuz it can change due to powerups
    paddleHeight: number;
    ballSize: number;
  };
}

// full internal game state (backend only)
export interface FullGameState {
  ball: { x: number; y: number; vx: number; vy: number };
  paddles: { left: number; right: number };
  scores: { left: number; right: number };
  players: { left: string; right: string };
  powerUp: PowerUp | null;
  activeEffects: {
    left: { type: string; expiresAt: number } | null;
    right: { type: string; expiresAt: number } | null;
  };
  config: GameConfig; // original config, never changes
  socketToUser: Map<string, number>;
  isEnding: boolean;
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

// default config for pong game
export const pongConfig: GameConfig = {
  canvasWidth: 800,
  canvasHeight: 600,
  paddleHeight: 100,
  paddleWidth: 16,
  leftPaddleOffset: 20,
  rightPaddleOffset: 20,
  ballSize: 10,
  paddleSpeed: 10,
  ballSpeed: 4,
  winningScore: 5,
  gameName: "pong",
};

export interface PowerUp {
  x: number;
  y: number;
  type: "bigPaddle" | "freeze" | "speedBoost" | "smallBall";
  active: boolean;
}