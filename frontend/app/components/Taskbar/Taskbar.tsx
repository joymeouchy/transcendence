"use client";

import { useEffect, useState } from "react";
import "./Taskbar.scss";

export default function Taskbar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
    <div className="xp-taskbar">

      <div className="xp-start">
        Start
      </div>

      <div className="xp-taskbar-center" />

      <div className="xp-clock">
        <div>{formattedTime}</div>
        <div className="xp-date">{formattedDate}</div>
      </div>

    </div>
  );
}