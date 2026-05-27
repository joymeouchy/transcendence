"use client";
import { useState } from "react";


import XPWindow from "../components/ui/XPWindow/XPWindow";
import XPModal from "../components/ui/XPModal/XPModal";
import XPButton from "../components/ui/XPButton/XPButton";
import XPPanel from "../components/ui/XPPanel";

import { images } from "@/lib/images";

export default function TestPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div
      style={{
        backgroundImage: `url(${images.windowsDefaultWallpaper})`,
        backgroundSize: "cover",
        minHeight: "100vh",
        padding: "40px",
      }}
    >
      <XPWindow title="Pong.exe">
        <XPPanel>
          <h3 style={{ marginTop: 0 }}>Player Stats</h3>

          <div style={{ display: "grid", gap: "6px" }}>
            <div>🏆 Wins: <b>24</b></div>
            <div>💀 Losses: <b>10</b></div>
            <div>📈 Win Rate: <b>70%</b></div>
            <div>🔥 Streak: <b>+5</b></div>
            <div>🎮 Games Played: <b>34</b></div>
          </div>
        </XPPanel>

        <div style={{ marginTop: "12px" }}>
          <XPButton onClick={() => setIsModalOpen(true)}>
            Open Modal
          </XPButton>
        </div>
      </XPWindow>

      <XPModal
        title="Connection Error"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <XPPanel>
          <p>Failed to connect to server.</p>
        </XPPanel>

        <div style={{ marginTop: "12px" }}>
          <XPButton onClick={() => setIsModalOpen(false)}>
            OK
          </XPButton>
        </div>
      </XPModal>
    </div>
  );
}