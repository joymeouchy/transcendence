"use client";

import { useEffect, useState } from "react";

import { socket } from "../../lib/socket";

import GameCanvas from "../components/game/GameCanvas";
import MatchSelectModal from "../components/game/MatchSelectModal/MatchSelectModal";
import MatchmakingModal, {
  MatchmakingStatus,
} from "../components/game/MatchMakingModal/MatchmakingModal";

import "./page.scss";

type ModalState =
  | "select"
  | "matchmaking"
  | "playing";

export default function GamePage() {
  const [modalState, setModalState] =
    useState<ModalState>("select");

  const [matchmakingStatus, setMatchmakingStatus] =
    useState<MatchmakingStatus>("searching");

  const [opponentName, setOpponentName] =
    useState("");

  useEffect(() => {
    socket.connect();

    const handleConnect = () => {
      console.log("Socket connected:", socket.id);
    };

    const handleMatchFound = (data: {
      opponentName: string;
    }) => {
      console.log("Match found!", data);

      setOpponentName(data.opponentName);

      setMatchmakingStatus("found");

      // Briefly show the "Match Found" dialog before starting the game
      setTimeout(() => {
        setModalState("playing");
      }, 1000);
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
    if (!socket.connected) {
      console.warn("Socket not connected yet");
      return;
    }

    socket.emit("join_queue");

    setMatchmakingStatus("searching");
    setModalState("matchmaking");
  };

  const playFriend = () => {
    // Friend matchmaking can be implemented later.
    // For now we reuse the matchmaking modal.

    setMatchmakingStatus("waitingFriend");
    setModalState("matchmaking");
  };

  const cancelMatchmaking = () => {
    if (socket.connected) {
      socket.emit("leave_queue");
    }

    setOpponentName("");
    setModalState("select");
  };

  return (
    <div className="game-page">
      <div className="game-container">
        <GameCanvas />
      </div>

      <MatchSelectModal
        isOpen={modalState === "select"}
        onClose={() => {}}
        onStartOnline={joinQueue}
        onPlayFriend={playFriend}
      />

      <MatchmakingModal
        isOpen={modalState === "matchmaking"}
        status={matchmakingStatus}
        opponentName={opponentName}
        onCancel={cancelMatchmaking}
      />
    </div>
  );
}