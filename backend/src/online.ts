// This is a map of userId to a set of connected socketIds. If the set is non-empty, the user is online.
// The map is updated in server.ts's connection/disconnect handlers, and is used by the
// REST API to determine if a user is online without having to query the database.
// Note: This is a simple in-memory implementation. In a multi-instance deployment, 
// you would need to use a shared store (e.g., Redis) instead of a plain in-process map.
export const onlineUsers = new Map<number, Set<string>>(); // userId → connected socketIds

export function isUserOnline(userId: number): boolean {
  return (onlineUsers.get(userId)?.size ?? 0) > 0;
}
