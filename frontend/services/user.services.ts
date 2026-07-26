import { api } from "@/lib/api";
import { UserProfile } from "@/types/types.dto";

export interface UserSearchResult {
  id: number;
  username: string;
  avatarUrl: string | null;
  isOnline: boolean;
}

export const UserService = {
  /**
   * Get the authenticated user
   */
  async getMe(): Promise<UserProfile> {
    const { data } = await api.get<UserProfile>("/users/me");
    return data;
  },

  /**
   * Get a user's public profile
   */
  async getById(id: number): Promise<UserProfile> {
    const { data } = await api.get<UserProfile>(`/users/${id}`);
    return data;
  },

  /**
   * Search users by username
   */
  async search(query: string): Promise<UserSearchResult[]> {
    const { data } = await api.get<UserSearchResult[]>("/users/search", {
      params: {
        q: query,
      },
    });

    return data;
  },
};