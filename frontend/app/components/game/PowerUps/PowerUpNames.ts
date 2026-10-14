const POWER_UP_NAMES: Record<string, string> = {
  bigPaddle: "Giant Paddle",
  smallPaddle: "Tiny Paddle",
  freeze: "Freeze!",
  smallBall: "Mini Ball",
  paddleSpeedBoost: "Paddle Speed Boost",
};

export function formatPowerUpName(type: string): string {
  return (
    POWER_UP_NAMES[type] ??
    type.replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replace(/^./, (char) => char.toUpperCase())
  );
}