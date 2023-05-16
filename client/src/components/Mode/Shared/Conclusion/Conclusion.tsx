import React from "react";
import Image from "next/image";
import { playAudio } from "@utils/helpers/audio.helper";

export const getWinnerIcons = (wins: number = 0, isCurrent: boolean) => {
  return wins > 0 ? (
    <div className={`hand__wins ${isCurrent ? "hand__wins--current" : ""}`}>
      <span className="hand__counter">{wins}</span>
      <Image width={75} height={75} alt="wreath" src="/images/wreath.png" />
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
