import { io } from "socket.io-client";
import { tokenStorage } from "@/lib/token";

// the socket URL is the site origin, not the API URL: io() treats a path
// like "/api" as a namespace, and Caddy routes /socket.io/* to the backend
export const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "https://localhost:8443", {
  autoConnect: false,
  // cb is callback function that returns the token from tokenStorage.get()
  // in case the user signed out and signed in again, the token will be updated and sent to the server
  auth: (cb) => cb({ token: tokenStorage.get() }),
});
  const t = () => new Date().toISOString().slice(11, 23);

socket.on("connect", () => console.log(`[SOCK ${t()}] connect`, socket.id));
socket.on("disconnect", (reason) =>
  console.log(`[SOCK ${t()}] disconnect`, reason)
);
socket.on("connect_error", (err) =>
  console.log(`[SOCK ${t()}] connect_error`, err.message)
);
socket.onAny((event) => {
  if (event !== "game_state") console.log(`[SOCK ${t()}] event`, event, socket.id);
});
const realDisconnect = socket.disconnect.bind(socket);
socket.disconnect = (() => {
  console.trace(`[SOCK ${t()}] disconnect() CALLED`);
  return realDisconnect();
}) as typeof socket.disconnect;

const realConnect = socket.connect.bind(socket);
socket.connect = (() => {
  console.trace(`[SOCK ${t()}] connect() CALLED`);
  return realConnect();
}) as typeof socket.connect;
