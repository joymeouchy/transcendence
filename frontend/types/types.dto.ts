export interface UserProfile {
  id: number;
  username: string;
  email: string;
  avatarUrl: string | null;
  provider: string;
  isOnline: boolean;
  wins: number;
  losses: number;
  totalMatches: number;
  winRate: number;
}
