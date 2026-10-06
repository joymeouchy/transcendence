import { io } from "socket.io-client";
import { tokenStorage } from "@/lib/token";

// the socket URL is the site origin, not the API URL: io() treats a path
// like "/api" as a namespace, and Caddy routes /socket.io/* to the backend
export const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "https://localhost", {
  autoConnect: false,
  // cb is callback function that returns the token from tokenStorage.get()
  // in case the user signed out and signed in again, the token will be updated and sent to the server
  auth: (cb) => cb({ token: tokenStorage.get() }),
});
