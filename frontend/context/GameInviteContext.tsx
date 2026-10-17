"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

import { socket } from "@/lib/socket";

export type IncomingInvite = {
  fromUserId: number;
  fromUsername: string;
  fromAvatarUrl: string | null;
  winningScore: number;
};

type GameInviteContextType = {
  incomingInvite: IncomingInvite | null;
  isJoiningGame: boolean;
  respondToInvite: (fromUserId: number, accepted: boolean) => void;
  clearIncomingInvite: () => void;
  clearJoiningGame: () => void;
};

const GameInviteContext = createContext<GameInviteContextType | undefined>(
  undefined
);

export function GameInviteProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [incomingInvite, setIncomingInvite] = useState<IncomingInvite | null>(
    null
  );
  const [isJoiningGame, setIsJoiningGame] = useState(false);

  useEffect(() => {
    const handleInviteReceived = (data: IncomingInvite) => {
      setIncomingInvite(data);
    };

    const handleInviteCancelled = (data: { fromUserId: number }) => {
      setIncomingInvite((current) => {
        if (current?.fromUserId === data.fromUserId) {
          return null;
        }

        return current;
      });
    };

    socket.on("invite_received", handleInviteReceived);

    socket.on("invite_cancelled", handleInviteCancelled);

    return () => {
      socket.off("invite_received", handleInviteReceived);

      socket.off("invite_cancelled", handleInviteCancelled);
    };
  }, []);

  function respondToInvite(fromUserId: number, accepted: boolean) {
    if (!socket.connected) return;

    if (accepted) {
      setIsJoiningGame(true);
    }

    socket.emit("invite_response", {
      fromUserId,
      accepted,
    });

    setIncomingInvite(null);
  }

  const clearJoiningGame = useCallback(() => {
  setIsJoiningGame(false);
}, []);

  function clearIncomingInvite() {
    setIncomingInvite(null);
  }

  return (
    <GameInviteContext.Provider
      value={{
        incomingInvite,
        isJoiningGame,
        respondToInvite,
        clearIncomingInvite,
        clearJoiningGame,
      }}
    >
      {children}
    </GameInviteContext.Provider>
  );
}

export function useGameInvite() {
  const context = useContext(GameInviteContext);

  if (!context) {
    throw new Error("useGameInvite must be used inside GameInviteProvider");
  }

  return context;
}
