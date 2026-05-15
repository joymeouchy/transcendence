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

    const handleConnect = () => {
      console.log("Socket connected:", socket.id);
    };

    const handleMatchFound = () => {
      setShowModal(false);
    };

    socket.on("connect", handleConnect);
    socket.on("match_found", handleMatchFound);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("match_found", handleMatchFound);
      socket.disconnect();
    };
  }, []);

  const joinQueue = () => {
    console.log("connected?", socket.connected);

    if (!socket.connected) {
      console.warn("Socket not connected yet");
      return;
    }

    socket.emit("join_queue");
  };

  return (
    <div className="game-page">
      <div className="game-container">
        <div className="scoreboard">
          
          {/* i commented this because the scores are rendered in GameCanvas
           <div>0</div>
          <div>0</div> */}
        </div>

        <GameCanvas />
      </div>

      {showModal && <GameModal onPlay={joinQueue} />}
    </div>
  );
}