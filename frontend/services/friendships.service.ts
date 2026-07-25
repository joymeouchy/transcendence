import { api } from "@/lib/api";

export interface Friend {
  friendshipId: number;
  id: number;
  username: string;
  avatarUrl: string | null;
  isOnline: boolean;
}

export interface PendingRequest {
  id: number;
  senderId: number;
  receiverId: number;
  status: string;
  sender: {
    id: number;
    username: string;
    avatarUrl: string | null;
  };
}

export interface Friendship {
  id: number;
  senderId: number;
  receiverId: number;
  status: string;
}

export async function sendFriendRequest(
  senderId: number,
  receiverId: number
): Promise<Friendship> {
  const response = await api.post("/friendships/send", {
    senderId,
    receiverId,
  });

  return response.data;
}


/**
 * Accept a friend request
 */
export async function acceptFriendRequest(
  friendshipId: number
): Promise<Friendship> {
  const response = await api.patch(
    `/friendships/accept/${friendshipId}`
  );

  return response.data;
}


/**
 * Reject / remove a friendship
 */
export async function removeFriendship(
  friendshipId: number
): Promise<{ message: string }> {
  const response = await api.delete(
    `/friendships/reject/${friendshipId}`
  );

  return response.data;
}


/**
 * Get user's friends
 */
export async function getFriends(
  userId: number
): Promise<Friend[]> {
  const response = await api.get(
    `/friendships/${userId}`
  );

  return response.data;
}


/**
 * Get pending friend requests
 */
export async function getPendingRequests(
  userId: number
): Promise<PendingRequest[]> {
  const response = await api.get(
    `/friendships/pending/${userId}`
  );

  return response.data;
}