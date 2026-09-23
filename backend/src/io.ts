// Holds the live Server instance so REST routes can emit socket events (e.g.
// pushing a new chat message to a recipient) without importing server.ts
// directly, which would create a circular import (server.ts is what mounts
// the routes in the first place).
import type { Server } from "socket.io";

let io: Server | null = null;

export function setIo(server: Server) {
  io = server;
}

export function getIo(): Server {
  if (!io) {
    throw new Error("io accessed before the socket server was initialized");
  }
  return io;
}
