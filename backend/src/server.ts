//to run -> npx ts-node-dev src/server.ts
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
dotenv.config();
import express from "express";
import cors from "cors";
import http from "http";
import path from "path";
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
} from "./game";
import passport from "./OAuth";
import userRoutes from "../routes/users";
import { PrismaClient } from "../generated/prisma/client";
import friendshipRoutes from "../routes/friendships";

const prisma = new PrismaClient();

import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Transcendence API",
      version: "1.0.0",
      description: "Pong game backend API",
    },
  },
  apis: [path.join(__dirname, "../routes/*.ts")],
};

const PORT = 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
let waitingPlayer: any = null;
let matchId = 0;
const socketToUser = new Map<string, number>(); // socketId → userId
const onlineUsers = new Map<number, string>(); // userId → socketId
const rematches = new Map<string, string[]>(); // room → [socketIds who want rematch]

const app = express();
app.use(
  cors({
    origin: FRONTEND_URL,
  }),
);
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use(passport.initialize());
app.use("/friendships", friendshipRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
  },
  connectionStateRecovery: {},
});

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  if (socket.recovered) {
    const room = findRoomBySocket(socket.id);
    if (room) {
      cancelGameCleanup(room);
      resumeGame(io, room);
      io.to(room).emit("player_reconnected");
      console.log("Recovered session, resumed game in room:", room);
    }
  }

  socket.on("join_queue", () => {
    console.log(socket.id, "wants to play");

    if (waitingPlayer === null) {
      waitingPlayer = socket;
      socket.emit("waiting");
    } else if (waitingPlayer.id === socket.id) {
      socket.emit("already_waiting");
    } else {
      const room = `match-${matchId++}`;

      // join both players
      socket.join(room);
      waitingPlayer.join(room);

      console.log("Match created:", room);

      // notify both players
      io.to(room).emit("match_found", {
        room,
        players: [waitingPlayer.id, socket.id],
      });

      // start game loop
      startGame(io, room, waitingPlayer.id, socket.id, socketToUser);
      console.log("Game started in room:", room);

      // reset queue
      waitingPlayer = null;
    }
  });

  // handle paddle movement
  socket.on(
    "paddle_move",
    ({ room, direction }: { room: string; direction: "up" | "down" }) => {
      handlePaddleMove(socket.id, room, direction);
    },
  );

  socket.on("request_rematch", ({ room }: { room: string }) => {
    if (!rematches.has(room)) {
      rematches.set(room, []);
    }

    const players = rematches.get(room)!;

    if (!players.includes(socket.id)) {
      players.push(socket.id);
    }

    // notify other player that this player wants a rematch
    socket.to(room).emit("rematch_requested");

    // if both players want a rematch
    if (players.length === 2) {
      rematches.delete(room);

      // create new room
      const newRoom = `match-${matchId++}`;
      const [player1, player2] = players;

      if (!player1 || !player2) return;

      const p1Socket = io.sockets.sockets.get(player1);
      const p2Socket = io.sockets.sockets.get(player2);

      if (p1Socket && p2Socket) {
        p1Socket.join(newRoom);
        p2Socket.join(newRoom);

        io.to(newRoom).emit("match_found", {
          room: newRoom,
          players: [player1, player2],
        });

        startGame(io, newRoom, player1, player2, socketToUser);
        console.log("Rematch started in room:", newRoom);
      }
    }
  });

  socket.on("decline_rematch", ({ room }: { room: string }) => {
    rematches.delete(room);
    socket.to(room).emit("rematch_declined");
  });

  socket.on("user_online", async ({ userId }: { userId: number }) => {
    socketToUser.set(socket.id, userId);
    onlineUsers.set(userId, socket.id);

    await prisma.user.update({
      where: { id: userId },
      data: { isOnline: true },
    });

    console.log(`User ${userId} is online`);
  });

  socket.on("leave_queue", () => {
    if (waitingPlayer?.id === socket.id) {
      waitingPlayer = null;
      console.log(socket.id, "left the queue");
    }
  });

  socket.on("disconnect", async () => {
    const userId = socketToUser.get(socket.id);
    if (userId) {
      onlineUsers.delete(userId);
      socketToUser.delete(socket.id);

      await prisma.user.update({
        where: { id: userId },
        data: { isOnline: false },
      });

      console.log(`User ${userId} is offline`);
    }
    console.log("Disconnected:", socket.id);

    if (waitingPlayer?.id === socket.id) {
      waitingPlayer = null;
    }

    // pause the game and give the player a chance to reconnect before
    // ending the match, instead of killing it on the first dropped packet
    const room = findRoomBySocket(socket.id);
    if (room) {
      pauseGame(room);
      io.to(room).emit("player_disconnected");
      scheduleGameCleanup(io, room, socket.id);
    }
  });
});
