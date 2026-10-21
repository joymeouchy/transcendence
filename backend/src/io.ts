// shares the Socket.IO server with the REST routes, so a route can push a live
// event to a user. for example POST /messages saves the message, then emits
// receive_message to the receiver's sockets.

import type { Server } from "socket.io"; // the type only, no runtime code

// null until server.ts creates the socket server and calls setIo()
let io: Server | null = null;

// called once in server.ts, right after `new Server(...)`
export function setIo(server: Server) {
  io = server;
}

// used by the routes (messages.ts, users.ts) and game_helpers.ts.
// throws instead of returning null so a mistake shows up as a clear error,
export function getIo(): Server {
  if (!io) {
    throw new Error("io accessed before the socket server was initialized");
  }
  return io;
}
