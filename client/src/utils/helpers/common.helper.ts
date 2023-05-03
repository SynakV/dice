import { ASSETS } from "@utils/constants";

export const cacheAssets = async () => {
  return new Promise(async (res) => {
    const images = await ASSETS.IMAGES.map((src) => {
      return new Promise((res, rej) => {
        const img = new Image();

        img.src = `/images/${src}`;
        img.onload = () => res(null);
        img.onerror = () => rej();
      });
    });

    const audios = await ASSETS.SOUNDS.map((src) => {
      return new Promise((res, rej) => {
        const audio = new Audio(`/sounds/${src}.mp3`);

        audio.oncanplaythrough = () => res(null);
        audio.onerror = () => rej();
      });
    });

    await Promise.all([...images, ...audios]);

    res(null);
  });
};

export const getNameFormatted = (name: string) => {
  let newName = name;

  if (name.length > 15) {
    newName = `${name.substring(0, 8)}...`;
  }

  return name;
};
