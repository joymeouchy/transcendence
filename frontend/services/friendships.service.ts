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
  sender: {
    id: number;
    username: string;
    avatarUrl: string | null;
  };
}

export const FriendshipService = {
  async getFriends(userId: number): Promise<Friend[]> {
    const { data } = await api.get<Friend[]>(`/friendships/${userId}`);
    return data;
  },

  async getPendingRequests(userId: number): Promise<PendingRequest[]> {
    const { data } = await api.get<PendingRequest[]>(
      `/friendships/pending/${userId}`
    );

    return data;
  },

  async sendRequest(senderId: number, receiverId: number) {
    const { data } = await api.post("/friendships/send", {
      senderId,
      receiverId,
    });

    return data;
  },

  async acceptRequest(friendshipId: number) {
    const { data } = await api.patch(
      `/friendships/accept/${friendshipId}`
    );

    return data;
  },

  async rejectRequest(friendshipId: number) {
    const { data } = await api.delete(
      `/friendships/reject/${friendshipId}`
    );

    return data;
  },
};