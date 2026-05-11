export interface GameConfig {
  canvasWidth: number;
  canvasHeight: number;
  paddleHeight: number;
  paddleWidth: number;
  ballSize: number;
  paddleSpeed: number;
  ballSpeed: number;
  winningScore: number;
  gameName: "pong"; // we can add hockey here later
}

export const pongConfig: GameConfig = {
  canvasWidth: 800,
  canvasHeight: 600,
  paddleHeight: 100,
  paddleWidth: 10,
  ballSize: 10,
  paddleSpeed: 5,
  ballSpeed: 4,
  winningScore: 5,
  gameName: "pong",
};
