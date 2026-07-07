export interface UserProfileFields {
  username: string;
  tagline: string;

  wins: number;
  losses: number;
  
  isOnline: boolean;

  rank: string;
  mode: string;
  memberSince: string;

  avatarUrl?: string;
  id?: string;
}