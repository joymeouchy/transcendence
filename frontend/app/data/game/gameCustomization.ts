// app/data/gameCustomization.ts

export const gameThemes = {
	classic: {
		leftPaddle: "/pong_leftpadel_2.png",
		rightPaddle: "/pong_rightpadel_2.png",
		ball: "/pong_ball_2.png",
		background: "/pong_bg_2.png",
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