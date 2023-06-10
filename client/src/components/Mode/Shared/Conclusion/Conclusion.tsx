import React from "react";
import Image from "next/image";
import { playSound } from "@utils/contexts/MediaProvider";

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
    playSound(isGameWinner ? "gameWin" : "roundWin");
  } else {
    playSound(isGameWinner ? "gameLoose" : "roundLoose");
  }
};
