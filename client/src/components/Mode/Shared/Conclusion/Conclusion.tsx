import React from "react";
import Image from "next/image";
import { playAudio } from "@utils/helpers/audio.helper";

export const getWinnerIcons = (wins: number = 0) => {
  return wins > 0 ? (
    <div className="hand__wins">
      <span className="hand__wins-counter">{wins}</span>
      <Image
        width={75}
        height={75}
        alt="wreath"
        src="/images/wreath.png"
        className="hand__wins-img"
      />
    </div>
  ) : null;
};

export const playWinnerSound = (
  phase: "round" | "game",
  isYouAmongWinners: boolean
) => {
  const isGameWinner = phase === "game";

  if (isYouAmongWinners) {
    playAudio(isGameWinner ? "gameWin" : "roundWin");
  } else {
    playAudio(isGameWinner ? "gameLoose" : "roundLoose");
  }
};
