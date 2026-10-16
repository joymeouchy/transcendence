"use client";

import { useEffect, useState } from "react";
import { formatPowerUpName } from "./PowerUpNames";
import "./ActivePowerUp.scss";

type Props = {
  effect: {
    type: string;
    expiresAt: number;
  } | null;
};


export default function ActivePowerUp({ effect }: Props) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!effect) {
      setSeconds(0);
      return;
    }

    const updateTimer = () => {
      const remaining = Math.ceil(
        (effect.expiresAt - Date.now()) / 1000
      );

      setSeconds(Math.max(remaining, 0));
    };

    updateTimer();

    const interval = setInterval(updateTimer, 100);

    return () => clearInterval(interval);
  }, [effect]);

  if (!effect || seconds <= 0) return null;

  return (
    <div className="active-power-up">
      <div className="active-power-up-header">
      </div>

      <div className="active-power-up-content">
        <span className="active-power-up-name">
          {formatPowerUpName(effect.type)}
        </span>

        <span className="active-power-up-timer">
          {seconds}s
        </span>
      </div>
    </div>
  );
}