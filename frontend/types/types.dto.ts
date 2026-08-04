// export interface UserProfile {
//   id: number;
//   username: string;
//   email: string;
//   avatarUrl: string | null;
//   provider: string;
//   isOnline: boolean;
//   wins: number;
//   losses: number;
//   totalMatches: number;
//   winRate: number;
// }
export interface UserProfile {
	id: number;
	username: string;
	email?: string;
	avatarUrl: string | null;
	provider?: string;
	isOnline?: boolean;
	wins: number;
	losses: number;
	totalMatches: number;
	winRate: number;
}

export type Friend = {
	friendshipId: number;
	id: number;
	username: string;
	avatarUrl: string | null;
	isOnline: boolean;
};

export type FriendRequest = {
	id: number;

	sender: {
		id: number;
		username: string;
		avatarUrl: string | null;
	};
};
