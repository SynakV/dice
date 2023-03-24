import Image from "next/image";
import { WaveSvg } from "./WaveSvg";
import React, { useState } from "react";

const PLAYER = "player";

export const Music = () => {
  const [isPlaying, setIsPlaying] = useState(false);

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
  };

  return (
    <div className="music">
      <WaveSvg className={`amulet__wave ${isPlaying ? "play" : "pause"}`} />
      <Image
        priority
        width={100}
        height={55}
        alt="amulet"
        src="/images/amulet.png"
        className="music__icon"
      />
      <audio controls loop={true} id={PLAYER}>
        <source src="/music/music.mp3" type="audio/mp3" />
      </audio>
    </div>
  );
};
