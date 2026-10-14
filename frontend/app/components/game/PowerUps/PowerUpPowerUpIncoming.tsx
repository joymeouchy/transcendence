"use client";

import { useEffect, useState } from "react";
import "./PowerUpIncoming.scss";
import { formatPowerUpName } from "./PowerUpNames";

type Props = {
  powerUp: {
    type: string;
    side: "left" | "right";
    applyAt: number;
  } | null;
};

export default function PowerUpIncoming({ powerUp }: Props) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!powerUp) {
      setSeconds(0);
      return;
    }

    const updateCountdown = () => {
      const remaining = Math.ceil(
        (powerUp.applyAt - Date.now()) / 1000
      );

      setSeconds(Math.max(remaining, 0));
    };

    updateCountdown();

    const interval = setInterval(updateCountdown, 100);

    return () => clearInterval(interval);
  }, [powerUp]);

  if (!powerUp || seconds <= 0) return null;

  return (
    <div
      className="power-up-warning"
      role="status"
      aria-live="off"
    >
      <div className="power-up-icon">
        <span>⚡</span>
      </div>

      <div className="power-up-info">
        <span className="power-up-label">
          POWER-UP INCOMING
        </span>

        <span className="power-up-name">
          {formatPowerUpName(powerUp.type)}
        </span>

        <span className="power-up-target">
          {powerUp.side === "left" ? "LEFT" : "RIGHT"} PLAYER
        </span>
      </div>

      <div className="power-up-countdown">
        <span className="countdown-number">{seconds}</span>
        <span className="countdown-unit">SEC</span>
      </div>
    </div>
  );
}