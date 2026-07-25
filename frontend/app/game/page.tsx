"use client";

import { useEffect, useState } from "react";

import { socket } from "../../lib/socket";

import GameCanvas from "../components/game/GameCanvas";
import MatchSelectModal from "../components/game/MatchSelectModal/MatchSelectModal";
import MatchmakingModal, {
  MatchmakingStatus,
} from "../components/game/MatchMakingModal/MatchmakingModal";

import GameOverModal from "../components/game/MatchMakingModal/GameOverModal";

import "./page.scss";

type ModalState =
  | "select"
  | "matchmaking"
  | "playing"
  | "result";

export default function GamePage() {
  console.log("GAME PAGE RENDERED");
  const [modalState, setModalState] =
    useState<ModalState>("select");

  const [matchmakingStatus, setMatchmakingStatus] =
    useState<MatchmakingStatus>("searching");

  const [opponentName, setOpponentName] =
    useState("");
  
  const [winner, setWinner] = useState("");
  const [scoreLeft, setScoreLeft] = useState(0);
  const [scoreRight, setScoreRight] = useState(0);
  const [currentUser, setCurrentUser] = useState("");

//  useEffect(() => {
//   console.log("GAME PAGE USE EFFECT STARTED");
//   socket.connect();

//   const handleConnect = () => {
//     console.log("Socket connected:", socket.id);
//     setCurrentUser(socket.id ?? "");
//   };

//   const handleMatchFound = (data: {
//   room: string;
//   players: string[];
// }) => {
//   console.log("Match found!", data);

//   const opponent = data.players.find(
//     (player) => player !== socket.id
//   );

//   setOpponentName(opponent ?? "Opponent");
//   setMatchmakingStatus("found");

//   setTimeout(() => {
//     setModalState("playing");
//   }, 1000);
// };

//   const handleGameOver = (data: {
//   winner: string;
//   scores: {
//     left: number;
//     right: number;
//   };
// }) => {
//   console.log("this is the data:", data);

//   setWinner(data.winner);
//   setScoreLeft(data.scores.left);
//   setScoreRight(data.scores.right);

//   setModalState("result");
// };

//   socket.on("connect", handleConnect);
//   socket.on("match_found", handleMatchFound);
//   socket.on("game_over", handleGameOver);

//   return () => {
//     return () => {
//   socket.off("connect", handleConnect);
//   socket.off("match_found", handleMatchFound);
//   socket.off("game_over", handleGameOver);
//   // socket.offAny(handleAnyEvent);
//   socket.disconnect();
// };
//   };
// }, []);

useEffect(() => {
  console.log("GAME PAGE USE EFFECT STARTED");

  socket.connect();

  const handleConnect = () => {
    console.log("Socket connected:", socket.id);
    setCurrentUser(socket.id ?? "");
  };

  const handleMatchFound = (data: {
    room: string;
    players: string[];
  }) => {
    console.log("Match found!", data);

    const opponent = data.players.find(
      (player) => player !== socket.id
    );

    setOpponentName(opponent ?? "Opponent");
    setMatchmakingStatus("found");

    setTimeout(() => {
      setModalState("playing");
    }, 1000);
  };

  const handleGameOver = (data: {
    winner: string;
    scores: {
      left: number;
      right: number;
    };
  }) => {
    console.log("GAME OVER DATA:", data);

    setWinner(data.winner);
    setScoreLeft(data.scores.left);
    setScoreRight(data.scores.right);

    setModalState("result");
  };

  socket.on("connect", handleConnect);
  socket.on("match_found", handleMatchFound);
  socket.on("game_over", handleGameOver);

  return () => {
    console.log("CLEANING SOCKET LISTENERS");

    socket.off("connect", handleConnect);
    socket.off("match_found", handleMatchFound);
    socket.off("game_over", handleGameOver);

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
      <GameOverModal
        isOpen={modalState === "result"}
        winner={winner}
        currentUser={currentUser}
        scoreLeft={scoreLeft}
        scoreRight={scoreRight}
        onRematch={() => {
          socket.emit("request_rematch");
        }}
        onFindNew={() => {
          setWinner("");
          joinQueue();
        }}
        onExit={() => {
          setWinner("");
          setOpponentName("");
          setModalState("select");
        }}
      />
    </div>
  );
}