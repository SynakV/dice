import { ASSETS } from "@utils/constants";

export const cacheAssets = async () => {
  return new Promise(async (res) => {
    const images = await ASSETS.IMAGES.map((src) => {
      return new Promise((res, rej) => {
        const img = new Image();

        img.src = `/images/${src}`;
        img.onload = () => {
          // callback();
          res(null);
        };
        img.onerror = () => rej();
      });
    });

    const audios = await ASSETS.SOUNDS.map((src) => {
      return new Promise((res, rej) => {
        const audio = new Audio(`/sounds/${src}.mp3`);

        audio.oncanplaythrough = () => {
          // callback();
          res(null);
        };
        audio.onerror = () => rej();
      });
    });

    // const videos = await ASSETS.VIDEOS.map((src) => {
    //   return new Promise((res, rej) => {
    //     const video = document.createElement("video");
    //     video.src = `/videos/${src}.mp4`;
    //     video.preload = "auto";

    //     video.oncanplay = () => {
    //       callback();
    //       res(null);
    //     };
    //     video.onerror = () => {
    //       rej();
    //     };
    //   });
    // });

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

// export const isRunningInElectron =
//   typeof navigator !== "undefined" &&
//   navigator.userAgent.toLowerCase().indexOf("electron") !== -1;
