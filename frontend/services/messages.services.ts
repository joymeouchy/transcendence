import { api } from "@/lib/api";
import { Message } from "@/types/messages";

export const MessagesService = {
	async getMessages(
		friendId: number
	): Promise<Message[]> {
		const response = await api.get<Message[]>(
			`/messages/${friendId}`
		);

		return response.data;
	},

	async sendMessage(
		receiverId: number,
		content: string
	): Promise<Message> {
		const response = await api.post<Message>(
			"/messages",
			{
				receiverId,
				content,
			}
		);

		return response.data;
	},
};