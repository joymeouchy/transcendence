export interface Message {
	id: number;
	senderId: number;
	receiverId: number;
	content: string;
	createdAt: string;
	sender?: {
		id: number;
		username: string;
		avatarUrl: string | null;
	};
}