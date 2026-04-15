//to run -> npx ts-node-dev src/server.ts
import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const PORT = 3001;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("ping", () => {
    console.log("Received ping");

    socket.emit("pong", { msg: "Hello from backend" });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});