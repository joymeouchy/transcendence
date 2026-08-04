// app/data/gameCustomization.ts

export const gameThemes = {
	classic: {
		leftPaddle: "/pong_bluepaddle.png",
		rightPaddle: "/pong_redpaddle.png",
		ball: "/pong_neon_ball.png",
		background: "/pong_classic_bg.png",
	},
};

export type GameTheme = keyof typeof gameThemes;