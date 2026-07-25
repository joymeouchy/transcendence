"use client";

import { useEffect, useState } from "react";

export default function TaskbarClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());

    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!time) {
    return (
      <div className="xp-clock">
        <div>--:-- --</div>
        <div className="xp-date">--/--/----</div>
      </div>
    );
  }

  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedDate = time.toLocaleDateString([], {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="xp-clock">
      <div>{formattedTime}</div>
      <div className="xp-date">{formattedDate}</div>
    </div>
  );
}