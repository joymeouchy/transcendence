export interface GameState {
  ball: { x: number; y: number; vx: number; vy: number };
  paddles: { left: number; right: number };
  scores: { left: number; right: number };
  players: { left: string; right: string };
}

export interface GameConfig {
  canvasWidth: number;
  canvasHeight: number;
  paddleHeight: number;
  paddleWidth: number;
  leftPaddleOffset: number; // distance from the left wall to the left paddle, matches GameCanvas.tsx's hardcoded draw position
  rightPaddleOffset: number; // distance from the right wall to the right paddle's outer edge, matches GameCanvas.tsx's hardcoded draw position
  ballSize: number;
  paddleSpeed: number;
  ballSpeed: number;
  winningScore: number;
  gameName: "pong"; // we can add here airHockey later
}

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