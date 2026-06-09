//to run -> npx ts-node-dev src/server.ts
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
dotenv.config();
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import authRoutes from "../routes/auth";
import { startGame, handlePaddleMove, games, gameIntervals } from "./game";
import passport from "./OAuth";

const PORT = 3001;
let waitingPlayer: any = null;
let matchId = 0;

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);
app.use(express.json());
app.use("/auth", authRoutes);
app.use(passport.initialize());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

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
      startGame(io, room, waitingPlayer.id, socket.id);
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

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);

    if (waitingPlayer?.id === socket.id) {
      waitingPlayer = null;
    }

    // notify other player and clean up game
    for (const [room, game] of Object.entries(games)) {
      if (game.players.left === socket.id || game.players.right === socket.id) {
        io.to(room).emit("player_disconnected");
        clearInterval(gameIntervals[room]);
        delete games[room];
        delete gameIntervals[room];
        break;
      }
    }
  });
});
