// app/data/gameCustomization.ts

export const gameThemes = {
	classic: {
		leftPaddle: "/pong_padel_0.png",
		rightPaddle: "/pong_padel_0.png",
		ball: "/pong_ball_0.png",
		background: "/pong_bg_0.png",
	},

	football: {
		leftPaddle: "/pong_leftpadel_1.png",
		rightPaddle: "/pong_rightpadel_1.png",
		ball: "/pong_ball_1.png",
		background: "/pong_bg_1.png",
	},

	// neon: {
	// 	leftPaddle: "/game/paddles/neon-left.png",
	// 	rightPaddle: "/game/paddles/neon-right.png",
	// 	ball: "/game/balls/neon.png",
	// 	background: "/game/backgrounds/neon.png",
	// },
};

export type GameTheme = keyof typeof gameThemes;