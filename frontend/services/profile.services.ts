import { api } from "@/lib/api";

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  avatarUrl: string | null;
  wins: number;
  losses: number;
  totalMatches: number;
}

export async function getUserProfile(id: number): Promise<UserProfile> {
  const response = await api.get(`/users/${id}`);

  return response.data;
}