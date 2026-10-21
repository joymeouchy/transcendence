import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
dotenv.config();
import express from "express";
import cors from "cors";
import http from "http";
import path from "path";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import authRoutes from "../routes/auth";
import {
  startGame,
  handlePaddleMove,
  findRoomBySocket,
  pauseGame,
  resumeGame,
  scheduleGameCleanup,
  cancelGameCleanup,
  abandonPausedGame,
} from "./game";
import {
  pongConfig,
  isValidWinningScore,
} from "../../frontend/types/game_types";
import passport from "./OAuth";
import userRoutes from "../routes/users";
import friendshipRoutes from "../routes/friendships";
import customizationRoutes from "../routes/customization";
import messageRoutes from "../routes/messages";
import { onlineUsers } from "./online";
import { setIo } from "./io";
import {
  pendingInvites,
  isUserBusy,
  reserveMatch,
  releaseMatch,
  getCurrentAvatarUrl,
} from "./helpers/game_helpers";
import { FRONTEND_URL, BACKEND_URL, JWT_SECRET } from "./urls";

import prisma from "../src/prisma";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

// Swagger: builds the /api-docs page from the @swagger comments in the route files
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Transcendence API",
      version: "1.0.0",
      description: "Pong game backend API",
    },
    // so "Try it out" calls go through Caddy's /api prefix instead of the site root
    servers: [{ url: BACKEND_URL }],
    // adds the "Authorize" button: paste a JWT once and every "Try it out"
    // request sends it as "Authorization: Bearer <token>".
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  // .ts when run with tsx, .js when run from the compiled dist folder
  apis: [path.join(__dirname, "../routes/*.{ts,js}")],
};

const PORT = 3001;
// the random matchmaking queue: the one socket waiting for an opponent, or
// null. one spot is enough, the next player who joins is matched with them
let waitingPlayer: any = null;
// counter for unique room names: match-0, match-1, ...
let matchId = 0;
const socketToUser = new Map<string, number>(); // socketId → userId
const rematches = new Map<string, string[]>(); // room → [socketIds who want rematch]
// socketId → the match room it was playing in when it dropped, checked on recovery.
const droppedFromRoom = new Map<string, string>();
// how long Socket.IO keeps a dropped session recoverable (its default, 2 min)
const RECOVERY_WINDOW_MS = 2 * 60 * 1000;
const INVITE_TIMEOUT_MS = 30000;
// room → max score chosen in the friend invite, kept after the match ends so
// a rematch is played to the same score. Only non-default scores are stored.
const roomWinningScores = new Map<string, number>();

const app = express();
// only the frontend's origin may call the API from a browser
app.use(
  cors({
    origin: FRONTEND_URL,
  }),
);
// parses JSON request bodies into req.body
app.use(express.json());
// serves files from backend/uploads (old avatars from before Supabase Storage)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use(passport.initialize());
app.use("/friendships", friendshipRoutes);
app.use("/customization", customizationRoutes);
app.use("/messages", messageRoutes);

// Express and Socket.IO share one HTTP server on port 3001: normal requests go
// to Express, /socket.io requests go to Socket.IO
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
  },
  // if a connection drops briefly, Socket.IO restores the same socket with
  // the same id and rooms when it reconnects within this time,
  // and replays the events it missed. that's what lets a match resume
  connectionStateRecovery: { maxDisconnectionDuration: RECOVERY_WINDOW_MS },
});

setIo(io);

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} (public URL: ${BACKEND_URL})`);
});

// Cleanup old messages every 24 hours, keeping only the last 7 days of messages.
const MESSAGE_RETENTION_MS = 7 * 24 * 60 * 60 * 1000;
const MESSAGE_CLEANUP_INTERVAL_MS = 24 * 60 * 60 * 1000;

async function cleanupOldMessages() {
  try {
    const { count } = await prisma.message.deleteMany({
      where: { createdAt: { lt: new Date(Date.now() - MESSAGE_RETENTION_MS) } },
    });
    if (count > 0) {
      console.log(`Cleaned up ${count} message(s) older than 7 days`);
    }
  } catch (err) {
    console.error("Failed to clean up old messages:", err);
  }
}

cleanupOldMessages();
setInterval(cleanupOldMessages, MESSAGE_CLEANUP_INTERVAL_MS);

// io.use is socket middleware: it runs once per new connection, before the
// "connection" handler. next() accepts the connection, next(error) refuses it.
// the client sends the token with io(url, { auth: { token } })
io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("No token provided"));
  }

  let decoded: { userId: number; username: string };

  try {
    decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      username: string;
    };
  } catch (err) {
    return next(new Error("Invalid or expired token"));
  }

  socket.data.userId = decoded.userId;
  socket.data.username = decoded.username;

  // fetched before next() so match_found can rely on it being
  // populated as soon as the connection is established
  const user = await prisma.user
    .findUnique({
      where: { id: decoded.userId },
      select: { avatarUrl: true, username: true },
    })
    .catch((err) => {
      console.error("Failed to fetch user on connect:", err);
      return null;
    });

  socket.data.avatarUrl = user?.avatarUrl ?? null;
  socket.data.username = user?.username ?? decoded.username;

  next();
});

// runs once for every socket that passed the auth middleware. the socket.on(...)
// handlers inside are the events this client can send. socket is this one
// client, io is everyone.
//
// sending events:
//   socket.emit(...)          → only this client
//   socket.to(room).emit(...) → everyone in the room except this client
//   io.to(room).emit(...)     → everyone in the room, this client included
//   io.emit(...)              → every connected client
io.on("connection", (socket) => {
  const userId = socket.data.userId as number;

  socketToUser.set(socket.id, userId);

  // track every socket per user so a second tab/device doesn't get knocked
  // offline when the first one disconnects
  let userSockets = onlineUsers.get(userId);
  if (!userSockets) {
    userSockets = new Set();
    onlineUsers.set(userId, userSockets);
  }
  const wasOffline = userSockets.size === 0;
  userSockets.add(socket.id);

  // only on the first tab, so friends' lists aren't told "online" again for every tab
  if (wasOffline) {
    io.emit("online_changed", { userId, isOnline: true });
  }

  // true when connectionStateRecovery restored a dropped socket (same id and
  // rooms). findRoomBySocket still finds its match, which was paused on disconnect
  if (socket.recovered) {
    const droppedRoom = droppedFromRoom.get(socket.id);
    droppedFromRoom.delete(socket.id);

    const room = findRoomBySocket(socket.id);
    if (room) {
      cancelGameCleanup(room);
      resumeGame(io, room);
      io.to(room).emit("player_reconnected");
      // console.log("Recovered session, resumed game in room:", room);
    } else if (droppedRoom) {
      // we dropped mid-match and the game is gone: the opponent left (or the
      // grace period ran out) while we were away, so tell the client to reset
      socket.leave(droppedRoom);
      socket.emit("game_abandoned");
      // console.log("Recovered session, game already gone in room:", droppedRoom);
    }
  }

  // random matchmaking: the first player waits, the second one is matched with
  // them, both join a new room and the game starts
  socket.on("join_queue", async () => {
    // console.log(socket.id, "wants to play");

    const currentRoom = findRoomBySocket(socket.id);
    if (currentRoom && abandonPausedGame(currentRoom)) {
      socket.leave(currentRoom);
    }

    // already playing (in this tab or another one): don't queue for a second game
    const queueingUserId = socketToUser.get(socket.id);
    if (
      findRoomBySocket(socket.id) ||
      (queueingUserId && isUserBusy(queueingUserId))
    ) {
      // console.log(socket.id, "tried to queue while already in a game");
      return;
    }

    if (waitingPlayer === null) {
      waitingPlayer = socket;
      socket.emit("waiting");
    } else if (waitingPlayer.id === socket.id) {
      socket.emit("already_waiting");
    } else {
      // check if same user joining from different window
      const waitingUserId = socketToUser.get(waitingPlayer.id);
      const joiningUserId = socketToUser.get(socket.id);

      if (waitingUserId && joiningUserId && waitingUserId === joiningUserId) {
        socket.emit("already_waiting");
        // console.log(
        //   "Same user tried to play against themselves:",
        //   joiningUserId,
        // );
        return;
      }

      const room = `match-${matchId++}`;
      const matchedWaitingPlayer = waitingPlayer;
      const matchedSocket = socket;

      waitingPlayer = null;
      reserveMatch(waitingUserId, joiningUserId);

      // join both players
      matchedSocket.join(room);
      matchedWaitingPlayer.join(room);

      // console.log("Match created:", room);

      // both avatar lookups run at the same time, Promise.all waits for both
      const [leftAvatar, rightAvatar] = await Promise.all([
        waitingUserId
          ? getCurrentAvatarUrl(waitingUserId)
          : matchedWaitingPlayer.data.avatarUrl,
        joiningUserId
          ? getCurrentAvatarUrl(joiningUserId)
          : matchedSocket.data.avatarUrl,
      ]);

      // notify both players
      io.to(room).emit("match_found", {
        room,
        players: [
          matchedWaitingPlayer.data.username,
          matchedSocket.data.username,
        ],
        avatars: {
          left: leftAvatar,
          right: rightAvatar,
        },
        winningScore: pongConfig.winningScore,
      });

      // start game loop
      startGame(
        io,
        room,
        matchedWaitingPlayer.id,
        matchedSocket.id,
        socketToUser,
      );
      releaseMatch(waitingUserId, joiningUserId);
      // console.log("Game started in room:", room);
    }
  });

  // handle paddle movement. the client sends one "up"/"down" per keydown
  socket.on(
    "paddle_move",
    ({ room, direction }: { room: string; direction: "up" | "down" }) => {
      handlePaddleMove(socket.id, room, direction);
    },
  );

  // rematch: both players stay in the finished match's room on the result
  // screen. rematches[room] collects who asked, and once both have, a new match starts
  socket.on("request_rematch", async (data: { room: string } | undefined) => {
    if (!data?.room) {
      console.warn("request_rematch received without room:", data);
      return;
    }
    const { room } = data;

    // only the players of that match can ask for its rematch. this also
    // happens after a reconnect with a new socket, which isn't in the old
    // room anymore, so answer instead of leaving the client on "Waiting..."
    if (!socket.rooms.has(room)) {
      socket.emit("rematch_declined");
      return;
    }

    // already playing another match (in this tab or another one)
    const requesterId = socketToUser.get(socket.id);
    if (requesterId && isUserBusy(requesterId)) {
      socket.emit("rematch_declined");
      return;
    }

    // the opponent left the result screen (they leave the room then),
    // disconnected, or started another match: treat it as a decline.
    // io.sockets.adapter.rooms.get(room) is the Set of socket ids in that room
    const opponentSocketId = [
      ...(io.sockets.adapter.rooms.get(room) ?? []),
    ].find((id) => id !== socket.id);
    const opponentId = opponentSocketId
      ? socketToUser.get(opponentSocketId)
      : undefined;
    if (!opponentSocketId || (opponentId && isUserBusy(opponentId))) {
      rematches.delete(room);
      socket.emit("rematch_declined");
      return;
    }

    if (!rematches.has(room)) {
      rematches.set(room, []);
    }
    const players = rematches.get(room)!;

    if (!players.includes(socket.id)) {
      players.push(socket.id);
    }

    // if both players want a rematch, let the other one know theirs got
    // accepted; otherwise this is the first request, so ask the other player
    if (players.length === 2) {
      socket.to(room).emit("rematch_accepted");
      rematches.delete(room);

      // create new room, played to the same max score as the previous match
      const newRoom = `match-${matchId++}`;
      const [player1, player2] = players;
      const winningScore =
        roomWinningScores.get(room) ?? pongConfig.winningScore;
      roomWinningScores.delete(room);

      if (!player1 || !player2) return;

      const p1Socket = io.sockets.sockets.get(player1);
      const p2Socket = io.sockets.sockets.get(player2);

      if (p1Socket && p2Socket) {
        p1Socket.join(newRoom);
        p2Socket.join(newRoom);

        const p1UserId = socketToUser.get(p1Socket.id);
        const p2UserId = socketToUser.get(p2Socket.id);
        reserveMatch(p1UserId, p2UserId);

        const [leftAvatar, rightAvatar] = await Promise.all([
          p1UserId ? getCurrentAvatarUrl(p1UserId) : p1Socket.data.avatarUrl,
          p2UserId ? getCurrentAvatarUrl(p2UserId) : p2Socket.data.avatarUrl,
        ]);

        io.to(newRoom).emit("match_found", {
          room: newRoom,
          players: [p1Socket.data.username, p2Socket.data.username],
          avatars: {
            left: leftAvatar,
            right: rightAvatar,
          },
          winningScore,
        });

        if (winningScore !== pongConfig.winningScore) {
          roomWinningScores.set(newRoom, winningScore);
        }
        startGame(io, newRoom, player1, player2, socketToUser, {
          ...pongConfig,
          winningScore,
        });
        releaseMatch(p1UserId, p2UserId);
        // console.log("Rematch started in room:", newRoom);
      } else {
        // one of them disconnected between requesting and matching
        // let whoever's still around know so they're not stuck waiting forever
        (p1Socket ?? p2Socket)?.emit("rematch_failed");
      }
    } else {
      // notify the other player that this player wants a rematch
      socket.to(room).emit("rematch_requested");
    }
  });

  socket.on("decline_rematch", (data: { room: string } | undefined) => {
    if (!data?.room) {
      console.warn("decline_rematch received without room:", data);
      return;
    }
    const { room } = data;
    if (!socket.rooms.has(room)) return;

    // also sent when a player leaves the result screen without answering.
    // only tell the opponent if a rematch was asked for: either they're
    // waiting on us, or we asked and their request popup is still open
    const asked = (rematches.get(room) ?? []).length > 0;
    rematches.delete(room);
    roomWinningScores.delete(room);
    if (asked) {
      socket.to(room).emit("rematch_declined");
    }

    // leave the finished match's room so later rematch requests for it
    // don't pop up while we're on another screen or in another match
    socket.leave(room);
  });

  // if opponent disconnects, the player can leave the paused game and go back to the queue
  socket.on("leave_game", () => {
    const room = findRoomBySocket(socket.id);
    if (room && abandonPausedGame(room)) {
      socket.leave(room);
      // console.log(socket.id, "left paused game in room:", room);
    }
  });

  socket.on("leave_queue", () => {
    if (waitingPlayer?.id === socket.id) {
      waitingPlayer = null;
      // console.log(socket.id, "left the queue");
    }
  });

  // friend invites: invite_friend → the friend gets invite_received → they answer
  // with invite_response. if accepted, a match starts with the max score the
  // inviter chose. the invite is cancelled after INVITE_TIMEOUT_MS without an answer
  socket.on(
    "invite_friend",
    ({
      friendId,
      winningScore,
    }: {
      friendId: number;
      winningScore?: number;
    }) => {
      const inviterId = socketToUser.get(socket.id);
      if (!inviterId) return;

      // optional: missing means the default, anything outside the allowed list is rejected
      const matchWinningScore = winningScore ?? pongConfig.winningScore;
      if (!isValidWinningScore(matchWinningScore)) {
        socket.emit("invite_error", { message: "Invalid max score." });
        return;
      }

      if (inviterId === friendId) {
        socket.emit("invite_error", { message: "You can't invite yourself." });
        return;
      }

      if (isUserBusy(inviterId)) {
        socket.emit("invite_error", { message: "You're already in a game." });
        return;
      }

      const friendSockets = onlineUsers.get(friendId);
      if (!friendSockets || friendSockets.size === 0) {
        socket.emit("invite_error", { message: "Your friend is offline." });
        return;
      }

      if (isUserBusy(friendId)) {
        socket.emit("invite_error", {
          message: "Your friend is already in a game.",
        });
        return;
      }

      const key = `${inviterId}:${friendId}`;
      if (pendingInvites.has(key)) {
        socket.emit("invite_error", {
          message: "You already invited this friend.",
        });
        return;
      }

      for (const pendingKey of pendingInvites.keys()) {
        // one outgoing invite at a time: if two friends both accepted, only one
        // match could start and the other friend would be left hanging
        if (pendingKey.startsWith(`${inviterId}:`)) {
          socket.emit("invite_error", {
            message: "You already have a pending invite.",
          });
          return;
        }

        // the invitee's popup only shows one invite at a time, so a second one
        // from someone else would hide the first and leave that inviter waiting
        if (pendingKey.endsWith(`:${friendId}`)) {
          socket.emit("invite_error", {
            message: "Your friend already has a pending invite.",
          });
          return;
        }
      }

      const timeout = setTimeout(() => {
        pendingInvites.delete(key);
        socket.emit("invite_timeout", { friendId });
        for (const friendSocketId of friendSockets) {
          io.to(friendSocketId).emit("invite_cancelled", {
            fromUserId: inviterId,
          });
        }
      }, INVITE_TIMEOUT_MS);

      pendingInvites.set(key, {
        inviterSocketId: socket.id,
        timeout,
        winningScore: matchWinningScore,
      });

      // sent to every tab of the friend. io.to(socketId) works because every
      // socket is automatically in a room named after its own id
      for (const friendSocketId of friendSockets) {
        io.to(friendSocketId).emit("invite_received", {
          fromUserId: inviterId,
          fromUsername: socket.data.username,
          fromAvatarUrl: socket.data.avatarUrl,
          winningScore: matchWinningScore,
        });
      }
    },
  );

  // the inviter cancelled their invite before the friend answered
  socket.on("cancel_invite", ({ friendId }: { friendId: number }) => {
    const inviterId = socketToUser.get(socket.id);
    if (!inviterId) return;

    const key = `${inviterId}:${friendId}`;
    const pending = pendingInvites.get(key);
    if (!pending) return;

    clearTimeout(pending.timeout);
    pendingInvites.delete(key);

    const friendSockets = onlineUsers.get(friendId);
    friendSockets?.forEach((friendSocketId) =>
      io.to(friendSocketId).emit("invite_cancelled", { fromUserId: inviterId }),
    );
  });

  // the invited friend accepted or declined. this socket is the friend,
  // fromUserId is the inviter
  socket.on(
    "invite_response",
    async ({
      fromUserId,
      accepted,
    }: {
      fromUserId: number;
      accepted: boolean;
    }) => {
      const responderId = socketToUser.get(socket.id);
      if (!responderId) return;

      const key = `${fromUserId}:${responderId}`;
      const pending = pendingInvites.get(key);
      if (!pending) {
        // the invite was cancelled just before this answer arrived (for
        // example the inviter's match started). the popup already sent the
        // accepter to the game page, so tell them, unless they're playing
        if (accepted && !isUserBusy(responderId)) {
          socket.emit("invite_error", {
            message: "This invite is no longer available.",
          });
        }
        return;
      }

      clearTimeout(pending.timeout);
      pendingInvites.delete(key);

      const inviterSocket = io.sockets.sockets.get(pending.inviterSocketId);
      if (!inviterSocket) {
        // inviter disconnected before the response: tell the accepter who
        // has already been sent to the game page and would otherwise just wait
        if (accepted) {
          socket.emit("invite_error", {
            message: "Your friend is no longer available.",
          });
        }
        return;
      }

      if (!accepted) {
        inviterSocket.emit("invite_declined", { friendId: responderId });
        return;
      }

      if (isUserBusy(fromUserId) || isUserBusy(responderId)) {
        // one of them started a game (possibly from another tab) since the
        // invite was sent. tell whoever is still waiting, but never the one
        // who's playing: the error screen would cover their running match
        if (!isUserBusy(fromUserId)) {
          inviterSocket.emit("invite_error", {
            message: "Your friend is no longer available.",
          });
        }
        if (!isUserBusy(responderId)) {
          socket.emit("invite_error", {
            message: "This invite is no longer available.",
          });
        }
        return;
      }

      // take either player out of the queue, including a tab other than the
      // one that sent/accepted the invite, so they can't be matched again
      const waitingUserId = waitingPlayer
        ? socketToUser.get(waitingPlayer.id)
        : undefined;
      if (waitingUserId === fromUserId || waitingUserId === responderId) {
        waitingPlayer = null;
      }

      reserveMatch(fromUserId, responderId);

      const room = `match-${matchId++}`;
      inviterSocket.join(room);
      socket.join(room);

      const [leftAvatar, rightAvatar] = await Promise.all([
        getCurrentAvatarUrl(fromUserId),
        getCurrentAvatarUrl(responderId),
      ]);

      io.to(room).emit("match_found", {
        room,
        players: [inviterSocket.data.username, socket.data.username],
        avatars: { left: leftAvatar, right: rightAvatar },
        winningScore: pending.winningScore,
      });

      if (pending.winningScore !== pongConfig.winningScore) {
        roomWinningScores.set(room, pending.winningScore);
      }
      startGame(io, room, inviterSocket.id, socket.id, socketToUser, {
        ...pongConfig,
        winningScore: pending.winningScore,
      });
      releaseMatch(fromUserId, responderId);
      // console.log("Friend match started in room:", room);
    },
  );

  // a socket closed (tab closed, network lost, logout). clean up everything it
  // was part of: online status, invites, the queue and a running match
  socket.on("disconnect", () => {
    const userId = socketToUser.get(socket.id);
    if (userId) {
      socketToUser.delete(socket.id);

      const userSockets = onlineUsers.get(userId);
      userSockets?.delete(socket.id);

      // only mark offline once every socket/tab for this user has disconnected.
      // No DB write and no await here - this stays fully synchronous so a
      // reconnect can't interleave between the Set mutation and the emit
      // (that gap is what let a stale disconnect race a newer connect before).
      if (!userSockets || userSockets.size === 0) {
        onlineUsers.delete(userId);
        io.emit("online_changed", { userId, isOnline: false });
        // console.log(`User ${userId} is offline`);
      }

      const stillOnline = onlineUsers.get(userId);
      for (const [key, pending] of pendingInvites) {
        // "4:9" → skip the first part (inviter), keep the invitee id "9"
        const [, inviteeIdStr] = key.split(":");

        if (pending.inviterSocketId === socket.id) {
          // the tab that sent the invite is gone - cancel it
          clearTimeout(pending.timeout);
          pendingInvites.delete(key);
          onlineUsers
            .get(Number(inviteeIdStr))
            ?.forEach((sId) =>
              io.to(sId).emit("invite_cancelled", { fromUserId: userId }),
            );
        } else if (Number(inviteeIdStr) === userId && !stillOnline) {
          // the invitee has no sockets left connected - treat as a decline
          clearTimeout(pending.timeout);
          pendingInvites.delete(key);
          io.sockets.sockets
            .get(pending.inviterSocketId)
            ?.emit("invite_declined", { friendId: userId });
        }
      }
    }

    if (waitingPlayer?.id === socket.id) {
      waitingPlayer = null;
    }

    // pause the game and give the player a chance to reconnect before
    // ending the match, instead of killing it on the first dropped packet
    const room = findRoomBySocket(socket.id);
    if (room) {
      // remembered so that, if this socket is recovered after the match is
      // gone, the connection handler can send it game_abandoned
      droppedFromRoom.set(socket.id, room);
      setTimeout(() => droppedFromRoom.delete(socket.id), RECOVERY_WINDOW_MS);
      pauseGame(room);
      io.to(room).emit("player_disconnected");
      scheduleGameCleanup(io, room, socket.id);
    }
  });
});
