import Image from "next/image";
import React, { useState, useEffect } from "react";
import { WaveSvg } from "@components/Music/WaveSvg";
import {
  getStorageItem,
  setStorageItem,
} from "@src/utils/helpers/storage/storage.helper";
import { STORAGE_ITEMS } from "@src/utils/helpers/storage/constants";

const PLAYER = "player";

export const Music = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShowAskForPlaying, setIsShowAskForPlaying] = useState(false);

  const handlePlay = () => {
    const player = document.getElementById(PLAYER) as HTMLAudioElement;

    if (!player) {
      return;
    }

    player.volume = 0.05;

    if (isPlaying) {
      player.pause();
      setIsPlaying(false);
    } else {
      player.play();
      setIsPlaying(true);
    }

    setIsShowAskForPlaying(false);
  };

  useEffect(() => {
    const isAskedForPlayingMusic = getStorageItem(
      STORAGE_ITEMS.IS_ASKED_FOR_PLAYING_MUSIC
    );
    if (!isAskedForPlayingMusic || isAskedForPlayingMusic === "false") {
      setIsShowAskForPlaying(true);
      setStorageItem(STORAGE_ITEMS.IS_ASKED_FOR_PLAYING_MUSIC, "true");
    }
  }, []);

  const handleMessageOk = () => {
    setIsShowAskForPlaying(false);
  };

  return (
    <>
      <div className="music">
        <WaveSvg className={`wave ${isPlaying ? "play" : "pause"}`} />
        <Image
          priority
          width={100}
          height={55}
          alt="amulet"
          className="amulet"
          onClick={handlePlay}
          src="/images/amulet.png"
        />
        <audio controls loop={true} id={PLAYER}>
          <source src="/music/music.mp3" type="audio/mp3" />
        </audio>
      </div>
      <div className={`overlay ${isShowAskForPlaying ? "visible" : "hidden"}`}>
        <div className="message">
          <i className="arrow up" />
          <span className="text" onClick={handleMessageOk}>
            Click on amulet to play background music
          </span>
        </div>
      </div>
    </>
  );
};
