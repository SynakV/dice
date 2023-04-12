export const playAudio = (url: string, isMuted: boolean = false) => {
  const audio = new Audio(`/sounds/${url}.mp3`);

  audio.volume = 0.05;
  audio.muted = isMuted;

  audio.play();

  return audio;
};
