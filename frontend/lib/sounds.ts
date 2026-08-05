export const playSound = (src: string) => {
  const audio = new Audio(src);
  audio.volume = 0.4;
  audio.play().catch(() => {
  });
};

export const sounds = {
	startup: "/sounds/Windows XP Startup.wav",
	shutdown: "/sounds/Windows XP Shutdown.wav", 
	alert: "/sounds/Windows XP Error.wav",
  notif: "/frontend/public/sounds/Windows Information Bar.wav",
  leftpaddlehit: "/sounds/retro-bit-hit-sfx.wav",
  rightpaddlehit: "/sounds/retro-pong-hit-sfx.wav",
  score: "/sounds/retro-buzzer-hit-sfx.wav",
}
