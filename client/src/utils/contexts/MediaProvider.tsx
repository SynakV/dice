import {
  FC,
  useState,
  useEffect,
  ReactNode,
  useContext,
  createContext,
} from "react";
import { useRouter } from "next/router";
import {
  getStorageItem,
  setStorageItem,
} from "@utils/helpers/storage/storage.helper";
import { STORAGE_ITEMS } from "@utils/helpers/storage/constants";

const DEFAULT_VALUES = {
  volume: 1,
  playMusic: () => {},
  setVolume: () => {},
  playVideo: () => {},
};

export const DEFAULT_FADE_TIME = 2000;

interface MediaContextType {
  volume: number;
  setVolume: (volume: number) => void;
  playVideo: (options: VideoOptionsType) => void;
  playMusic: (options: MusicOptionsType) => void;
}

type VideoOptionsType = {
  name?: string;
  isSwitchInPage?: boolean;
  appFadeDuration?: number;
  videoFadeDuraion?: number;
};

type MusicOptionsType = {
  name: string;
  switchDuration: number;
  isSwitchInPage?: boolean;
};

enum FADE {
  IN = "In",
  OUT = "Out",
}

export const MediaContext = createContext<MediaContextType>(DEFAULT_VALUES);

interface Props {
  children: ReactNode;
}

let newRoute = "";
let fadeInMusic: any = null;
let fadeOutMusic: any = null;
let volumeChangeFade: any = null;

export const MediaProvider: FC<Props> = ({ children }) => {
  const router = useRouter();

  const path = router.pathname;

  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [appFadeAnimation, setAppFadeAnimation] = useState("none");
  const [videoFadeAnimation, setVideoFadeAnimation] = useState("none");

  const [volume, setVolume] = useState(getVolume());
  const [music, setMusic] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const music = new Audio();
    music.volume = volume;
    music.loop = true;

    setMusic(music);

    if (!getStorageItem(STORAGE_ITEMS.VOLUME)) {
      setStorageItem(STORAGE_ITEMS.VOLUME, DEFAULT_VALUES.volume.toString());
    }
  }, []);

  useEffect(() => {
    router.events.on("routeChangeStart", handleRouterChangeStart);

    return () => {
      router.events.off("routeChangeStart", handleRouterChangeStart);
    };
  }, [music]);

  const playMusic = ({
    name,
    isSwitchInPage,
    switchDuration,
  }: MusicOptionsType) => {
    if (!music) {
      return;
    }

    if (!isSwitchInPage) {
      music.volume = 0;
    }

    const loadMusic = () => {
      if (music.src.includes(name)) {
        return;
      }

      music.src = `/music/${name}.mp3`;
      music.load();
      music.play();
    };

    if (isSwitchInPage) {
      return handleFadeMusic(FADE.OUT, switchDuration, () => {
        handleFadeMusic(FADE.IN, switchDuration, () => {});
        loadMusic();
      });
    }

    handleFadeMusic(FADE.IN, switchDuration, () => {});
    loadMusic();
  };

  const handleSetVolume = (volume: number) => {
    setVolume(volume);
    setStorageItem(STORAGE_ITEMS.VOLUME, volume.toString());

    if (!music) {
      return;
    }

    // clearInterval(volumeChangeFade);

    // const step = (music.volume - volume) / 3;
    // const volumeStep = Math.abs(step);

    // volumeChangeFade = setInterval(() => {
    //   if () {

    //   } else {

    //   }
    // }, 100);

    music.volume = volume;
  };

  const handleSetAppFadeAnimation = (
    name: FADE,
    duration: number,
    callback?: Function
  ) => {
    const fadeTime = duration || DEFAULT_FADE_TIME;

    setAppFadeAnimation(`${fadeTime}ms appFade${name} forwards`);

    if (callback) {
      setTimeout(() => {
        callback();
      }, fadeTime);
    }
  };

  const handleSetVideoFadeAnimation = (
    name: FADE,
    duration: number,
    callback?: Function
  ) => {
    const fadeTime = duration || DEFAULT_FADE_TIME;

    setVideoFadeAnimation(`${fadeTime}ms videoFade${name} forwards`);

    if (callback) {
      setTimeout(() => {
        callback();
      }, fadeTime);
    }
  };

  const handleFadeMusic = (
    type: FADE,
    duration: number,
    callback: Function,
    route?: string
  ) => {
    if (!music) {
      return;
    }

    clearInterval(fadeInMusic);
    clearInterval(fadeOutMusic);

    const volumeStep = getVolume() / 10;
    const volumeFade = duration / 10;

    if (type === FADE.IN) {
      fadeInMusic = setInterval(() => {
        console.log("In");
        if (music.volume >= volume || music.volume + volumeStep > volume) {
          music.volume = volume;
          callback();
          clearInterval(fadeInMusic);
          return;
        } else {
          music.volume += volumeStep;
        }
      }, volumeFade);
    }

    if (type === FADE.OUT) {
      fadeOutMusic = setInterval(() => {
        console.log("Out");
        if (music.volume <= 0 || music.volume - volumeStep < 0) {
          music.volume = 0;
          callback();
          clearInterval(fadeOutMusic);
          if (route) {
            router.push(route);
          }
          return;
        } else {
          music.volume -= volumeStep;
        }
      }, volumeFade);
    }
  };

  const playVideo = ({
    name,
    isSwitchInPage,
    appFadeDuration,
    videoFadeDuraion,
  }: VideoOptionsType) => {
    const video = document.getElementById("video") as HTMLVideoElement;
    const videoSource = document.createElement("source");

    if (!video || !videoSource) {
      return;
    }

    const loadVideo = () => {
      if (!name || video.currentSrc.includes(name)) {
        return;
      }

      if (video.childNodes.length) {
        video.removeChild(video.firstChild!);
      }

      videoSource.setAttribute("src", `/video/${name}.webm`);
      videoSource.setAttribute("type", "video/webm");
      video.setAttribute("crossorigin", "anonymous");
      video.appendChild(videoSource);
      video.load();
    };

    if (isSwitchInPage && videoFadeDuraion) {
      handleSetVideoFadeAnimation(FADE.OUT, videoFadeDuraion, () => {
        loadVideo();
        handleSetVideoFadeAnimation(FADE.IN, videoFadeDuraion);
      });
      return;
    }

    if (appFadeDuration) {
      handleSetAppFadeAnimation(FADE.IN, appFadeDuration);
      loadVideo();
      return;
    }

    if (videoFadeDuraion) {
      handleSetVideoFadeAnimation(FADE.IN, videoFadeDuraion);
      loadVideo();
      return;
    }
  };

  const handleRouterChangeStart = (route: string) => {
    if (!newRoute) {
      newRoute = route;

      playSound("click");

      handleFadeMusic(FADE.OUT, DEFAULT_FADE_TIME, () => {}, route);
      handleSetAppFadeAnimation(FADE.OUT, DEFAULT_FADE_TIME);

      throw null;
    }

    newRoute = "";
  };

  return (
    <MediaContext.Provider
      value={{ volume, playMusic, playVideo, setVolume: handleSetVolume }}
    >
      {children}
      <div
        id="video__overlay--switcher"
        style={{
          animation: appFadeAnimation,
        }}
      />
      <div
        id="video__overlay--background"
        style={{ animation: videoFadeAnimation }}
      />
      <div id="video__overlay--undervideo" />
      <video loop muted autoPlay id="video" />
    </MediaContext.Provider>
  );
};

export const useMedia = () => useContext(MediaContext);

export const playSound = (url: string, isMuted: boolean = false) => {
  const audio = new Audio(`/sounds/${url}.mp3`);

  audio.volume = getVolume();

  audio.muted = isMuted;

  audio.play();

  return audio;
};

const getVolume = () => {
  let volume = getStorageItem(STORAGE_ITEMS.VOLUME) || 1;

  if (typeof +volume !== "number" || +volume > 1 || +volume < 0) {
    volume = 1;
  }

  return +volume;
};
