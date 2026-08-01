// services/customization.service.ts

import { GameTheme } from "@/app/data/game/gameCustomization";


export interface GameCustomization {
	theme: GameTheme;
}


export const CustomizationService = {

	async getMine(): Promise<GameCustomization> {
		return {
			theme: "football",
		};
	},

	async update(
		data: GameCustomization
	) {
		return data;
	},
};