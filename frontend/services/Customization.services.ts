// services/Customization.services.ts

import { api } from "@/lib/api";


export interface CustomizationTheme {
	id: number;
	name: string;

	backgroundColor: string | null;
	backgroundImageUrl: string | null;

	leftPaddleColor: string | null;
	leftPaddleImageUrl: string | null;

	rightPaddleColor: string | null;
	rightPaddleImageUrl: string | null;

	ballColor: string | null;
	ballImageUrl: string | null;

	isDefault: boolean;
}

export interface UpdateWallpaperResponse {
	message: string;
	preferredWallpaper: string;
}

export const customizationService = {

	async getThemes(): Promise<CustomizationTheme[]> {
		const response =
			await api.get(
				"/customization"
			);

		return response.data;
	},



	async getMyTheme(): Promise<CustomizationTheme> {
		const response =
			await api.get(
				"/customization/me"
			);

		return response.data;
	},



	async updateTheme(
		themeName: string
	): Promise<CustomizationTheme> {

		const response =
			await api.patch(
				"/customization/me",
				{
					themeName,
				}
			);

		return response.data.theme;
	},

	async updateWallpaper(
		wallpaper: string
	): Promise<UpdateWallpaperResponse> {

		const response =
			await api.patch(
				"/customization/me/wallpaper",
				{
					wallpaper,
				}
			);

		return response.data;
	},
};
