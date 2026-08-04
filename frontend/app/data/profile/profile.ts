export interface UserProfileFields {
  username: string;

  wins: number;
  losses: number;
  
  isOnline: boolean;

  rank: string;
  mode: string;
  memberSince: string;

  avatarUrl?: string;
  id?: string;
}