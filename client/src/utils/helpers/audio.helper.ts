export const playAudio = (url: string) => {
  const audio = new Audio(`/sounds/${url}.mp3`);

  audio.volume = 0.05;

  audio.play();

  return audio;
};
