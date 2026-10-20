// shares the Socket.IO server with the REST routes, so a route can push a live
// event to a user. for example POST /messages saves the message, then emits
// receive_message to the receiver's sockets.
//
// why not just import io from server.ts: server.ts imports the route files, so
// if a route imported server.ts too, the two files would import each other
// (a circular import). this small file sits in between: server.ts calls setIo()
// once at startup, and the routes call getIo() when they need it
import type { Server } from "socket.io"; // the type only, no runtime code

// null until server.ts creates the socket server and calls setIo()
let io: Server | null = null;

// called once in server.ts, right after `new Server(...)`
export function setIo(server: Server) {
  io = server;
}

// used by the routes (messages.ts, users.ts) and game_helpers.ts.
// throws instead of returning null so a mistake shows up as a clear error,
// and so callers can use the result without checking for null every time
export function getIo(): Server {
  if (!io) {
    throw new Error("io accessed before the socket server was initialized");
  }
  return io;
}
