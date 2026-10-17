export const playSound = (src: string) => {
  const audio = new Audio(src);
  audio.volume = 0.4;
  audio.play().catch(() => {
  });
};

// Like playSound, but if the browser blocks autoplay (e.g. right after an
// OAuth redirect, before any user interaction), retry on the first click/key.
export const playSoundWhenAllowed = (src: string) => {
  const audio = new Audio(src);
  audio.volume = 0.4;
  audio.play().catch(() => {
    const retry = () => {
      window.removeEventListener("pointerdown", retry);
      window.removeEventListener("keydown", retry);
      audio.play().catch(() => {});
    };
    window.addEventListener("pointerdown", retry);
    window.addEventListener("keydown", retry);
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
