"use client";

import { useState } from "react";
import "./Taskbar.scss";

import TaskbarClock from "./TaskbarClock";
import StartButton from "./StartButton/StartButton";
import StartMenu from "./StartMenu/StartMenu";

export default function Taskbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="xp-taskbar fixed inset-x-0 bottom-0 z-1000 flex h-10 items-center justify-between p-0 font-xp text-xp-md text-xp-white">

      <StartButton
        open={open}
        onClick={() => setOpen(!open)}
      />

      <div className="xp-taskbar-center" />

      <TaskbarClock />

      <StartMenu
        open={open}
        onClose={() => setOpen(false)}
      />

    </div>
  );
}