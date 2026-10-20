// who is online right now: userId → the ids of that user's connected sockets.
// a user is online while they have at least one connected socket.
//
// a Set of sockets, not just true/false, because one account can be open in
// several tabs or devices, and each one has its own socket. closing one tab
// removes only that socket, so the user stays online until the last one closes.
//
// updated in server.ts: a socket is added on "connection" and removed on
// "disconnect". the REST API reads it to answer "is X online?" without a
// database query (the isOnline column in the database isn't used).
//
// note: this lives in the server's memory, so it's empty after a restart (the
// clients reconnect and fill it again) and wouldn't work with several backend
// servers. that would need a shared store like Redis instead
export const onlineUsers = new Map<number, Set<string>>();

// true if the user has at least one connected socket.
// `?.size ?? 0` gives 0 when the user isn't in the map at all
export function isUserOnline(userId: number): boolean {
  return (onlineUsers.get(userId)?.size ?? 0) > 0;
}
