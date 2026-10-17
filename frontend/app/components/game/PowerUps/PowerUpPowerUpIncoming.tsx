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
      className="power-up-warning absolute top-5 left-1/2 z-20 flex min-w-72.5 items-center gap-3 p-2 font-xp text-xp-sm text-xp-gray-900 max-[480px]:top-2.5 max-[480px]:w-max max-[480px]:max-w-[calc(100%_-_20px)] max-[480px]:min-w-0 max-[480px]:gap-2 max-[480px]:p-1.75"
      role="status"
      aria-live="off"
    >
      <div className="power-up-icon flex size-10.5 shrink-0 items-center justify-center text-xp-5xl max-[480px]:size-8.5 max-[480px]:text-xp-3xl">
        <span>⚡</span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-0.75">
        <span className="text-xp-xs font-bold tracking-[0.5px] text-xp-focus max-[480px]:text-xp-2xs">
          POWER-UP INCOMING
        </span>

        <span className="text-xp-lg font-bold text-xp-gray-900 capitalize max-[480px]:text-xp-base">
          {formatPowerUpName(powerUp.type)}
        </span>

        
      </div>

      <div className="power-up-countdown flex size-11.5 shrink-0 flex-col items-center justify-center text-xp-white max-[480px]:size-10">
        <span className="text-[21px] leading-none font-bold tabular-nums">{seconds}</span>
        <span className="mt-0.75 text-xp-2xs font-bold tracking-[0.5px]">SEC</span>
      </div>
    </div>
  );
}