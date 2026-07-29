import { io } from "socket.io-client";
import { tokenStorage } from "@/lib/token";

export const socket = io("http://localhost:3001", {
  autoConnect: false,
  // cb is callback function that returns the token from tokenStorage.get()
  // in case the user signed out and signed in again, the token will be updated and sent to the server
  auth: (cb) => cb({ token: tokenStorage.get() }),
});
