"use client";

import { useEffect, useState } from "react";
import { formatPowerUpName } from "./PowerUpNames";
import clsx from "clsx";
import "./ActivePowerUp.scss";

type Props = {
  effect: {
    type: string;
    expiresAt: number;
  } | null;
  // placement/size from the parent HUD
  className?: string;
  // shared text treatment of the parent HUD, applied to every label
  textClassName?: string;
};


export default function ActivePowerUp({ effect, className, textClassName }: Props) {
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
    <div
      className={clsx(
        "active-power-up flex w-fit max-w-full min-w-30 flex-col overflow-visible rounded-xp-sm font-xp text-xp-gray-900",
        className,
      )}
    >
      <div className="active-power-up-header flex items-center gap-1.25 px-1.75 py-1 text-xp-white">
      </div>

      <div className="flex min-w-0 items-start justify-between gap-2">
        <span className={clsx(textClassName, "min-w-0 flex-1 leading-[1.3] whitespace-normal! [overflow-wrap:anywhere]")}>
          {formatPowerUpName(effect.type)}
        </span>

        <span
          className={clsx(
            textClassName,
            "min-w-7.5 shrink-0 rounded-xp-xs border border-xp-steel-blue bg-xp-white px-1.25 py-0.75 text-center text-xp-sm font-bold text-xp-navy tabular-nums",
          )}
        >
          {seconds}s
        </span>
      </div>
    </div>
  );
}