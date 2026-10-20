import { findRoomBySocket } from "../game";
import { getIo } from "../io";
import { onlineUsers } from "../online";
import prisma from "../prisma";

// "inviterId:inviteeId" → the pending friend invite between them.
// the timeout cancels the invite if the friend doesn't answer in time
// (INVITE_TIMEOUT_MS in server.ts), and winningScore is the max score the
// inviter picked for the match
export const pendingInvites = new Map<
  string,
  { inviterSocketId: string; timeout: NodeJS.Timeout; winningScore: number }
>();

// users whose match was decided but isn't created yet (avatars still loading).
// without this, two invites accepted at the same moment could both pass the
// busy check during that await and put the same player in two matches
const startingMatch = new Set<number>();

// true if the user's match is being created, or if any of their sockets/tabs
// is in a running game. every tab is checked because one account can be open
// in several tabs, and being in a game in one of them makes the user busy
export function isUserBusy(userId: number): boolean {
  if (startingMatch.has(userId)) return true;
  const sockets = onlineUsers.get(userId);
  if (!sockets) return false;
  for (const socketId of sockets) {
    if (findRoomBySocket(socketId)) return true;
  }
  return false;
}

// a player just started a match: drop every invite they sent or received, so
// an invite popup can't stay open (and be accepted) while they're playing
export function cancelInvitesFor(userId: number | undefined) {
  if (!userId) return;

  for (const [key, pending] of pendingInvites) {
    // "4:9" → [4, 9]. skip invites this user isn't part of
    const [inviterId, inviteeId] = key.split(":").map(Number);
    if (inviterId !== userId && inviteeId !== userId) continue;

    clearTimeout(pending.timeout);
    pendingInvites.delete(key);

    // close the invite popup on every tab of the invitee
    onlineUsers
      .get(inviteeId!)
      ?.forEach((sId) =>
        getIo().to(sId).emit("invite_cancelled", { fromUserId: inviterId }),
      );

    // the friend got busy: tell the inviter, who is still waiting on them
    if (inviteeId === userId) {
      getIo().to(pending.inviterSocketId).emit("invite_error", {
        message: "Your friend started another game.",
      });
    }
  }
}

// reserveMatch and releaseMatch wrap every match creation in server.ts
// (queue, rematch, friend invite):
//   reserveMatch(a, b) → await the avatar lookups → startGame → releaseMatch(a, b)
// while the server waits on the avatars, other socket events can run. the
// reservation keeps both players busy during that gap

// call as soon as a match is decided, before any await: marks both players
// busy and drops their other invites right away. the ids can be undefined
// (a socket with no known user), those are skipped
export function reserveMatch(...userIds: (number | undefined)[]) {
  for (const id of userIds) {
    if (!id) continue;
    startingMatch.add(id);
    cancelInvitesFor(id);
  }
}

// call once startGame has run (the game itself keeps them busy from then on)
export function releaseMatch(...userIds: (number | undefined)[]) {
  for (const id of userIds) {
    if (id) startingMatch.delete(id);
  }
}

// socket.data.avatarUrl is only set once, when the socket connects, so a
// player who uploads a new avatar mid-session (without reconnecting) would
// otherwise keep showing the old one in-game. Look it up fresh instead.
export async function getCurrentAvatarUrl(userId: number): Promise<string | null> {
  const user = await prisma.user
    .findUnique({ where: { id: userId }, select: { avatarUrl: true } })
    .catch((err) => {
      console.error("Failed to fetch current avatar:", err);
      return null;
    });

  return user?.avatarUrl ?? null;
}
