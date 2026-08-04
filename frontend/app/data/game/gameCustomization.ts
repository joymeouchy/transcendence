// app/data/gameCustomization.ts

export const gameThemes = {
	classic: {
		leftPaddle: "/pong_bluepaddle.png",
		rightPaddle: "/pong_redpaddle.png",
		ball: "/pong_neon_ball.png",
		background: "/pong_classic_bg.png",
	},

	football: {
		leftPaddle: "/pong_football_leftpaddle.png",
		rightPaddle: "/pong_football_rightpaddle.png",
		ball: "/pong_football_ball.png",
		background: "/pong_football_bg.png",
	},

	// space: {
	// 	leftPaddle: "/pong_space_leftpaddle.png",
	// 	rightPaddle: "/pong_space_rightpaddle.png",
	// 	ball: "/pong_space_ball.png",
	// 	background: "/pong_space_bg.png",
	// },

	// neon: {
	// 	leftPaddle: "/pong_bluepaddle.png",
	// 	rightPaddle: "/pong_redpaddle.png",
	// 	ball: "/pong_neon_ball.png",
	// 	background: "/pong_classic_bg.png",
	// },
};

export type GameTheme = keyof typeof gameThemes;