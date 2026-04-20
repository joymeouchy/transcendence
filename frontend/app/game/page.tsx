"use client";

import { useEffect } from "react";
import { socket } from "../../lib/socket";

export default function GamePage() {
  useEffect(() => {
    socket.connect();

    socket.on("waiting", () => {
      console.log("Waiting for another player...");
    });

    socket.on("match_found", (data) => {
      console.log("Match found!", data);
    });

    return () => {
      socket.off("waiting");
      socket.off("match_found");
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Game Page</h1>

      <button onClick={() => socket.emit("join_queue")}>
        Play
      </button>
    </div>
  );
}