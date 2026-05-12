"use client";

import { useEffect, useState } from "react";
import { socket } from "../../lib/socket";

import GameCanvas from "../components/game/GameCanvas";
import GameModal from "../components/game/GameModal";

import "./page.scss";

export default function GamePage() {
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    socket.connect();

    socket.on("match_found", () => {
      setShowModal(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const joinQueue = () => {
    socket.emit("join_queue");
  };

  return (
    <div className="game-page">
      <div className="game-container">
        <div className="scoreboard">
          <div>0</div>
          <div>0</div>
        </div>

        <GameCanvas />
      </div>

      {showModal && <GameModal onPlay={joinQueue} />}
    </div>
  );
}