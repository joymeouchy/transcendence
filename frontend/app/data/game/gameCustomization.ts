// app/data/gameCustomization.ts

export const gameThemes = {
	football: {
		leftPaddle: "frontend/public/pong_leftpadel_1.png",
		rightPaddle: "frontend/public/pong_rightpadel_1.png",
		ball: "/frontend/public/pong_ball_1.png",
		background: "/frontend/public/pong_bg_1.png",
	},

	// neon: {
	// 	leftPaddle: "/game/paddles/neon-left.png",
	// 	rightPaddle: "/game/paddles/neon-right.png",
	// 	ball: "/game/balls/neon.png",
	// 	background: "/game/backgrounds/neon.png",
	// },
};

export type GameTheme =
	keyof typeof gameThemes;