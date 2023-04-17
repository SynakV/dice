import Image from "next/image";
import React, { useEffect } from "react";
import { useDesk } from "@utils/contexts/DeskContext";
import { Modal } from "@components/Shared/Modal/Modal";
import { playAudio } from "@utils/helpers/audio.helper";
import { STORAGE_ITEMS } from "@utils/helpers/storage/constants";
import { getStorageObjectItem } from "@utils/helpers/storage/storage.helper";
import {
  getWinTotals,
  getWinnersNamesArray,
  getWinnersNamesString,
} from "@utils/helpers/ranking/ranking.helper";
import { GAME_OPEN, useGame } from "@utils/contexts/GameContext";

export const Conclusion = () => {
  const { desk } = useDesk();
  const { gameOpen } = useGame();

  const rounds = desk.gameplay.rounds;

  const getWinnerIcons = (wins: number = 0) => {
    return wins > 0 ? (
      <div className="conclusion__wins">
        <span className="conclusion__wins-counter">{wins}</span>
        <Image
          width={125}
          height={125}
          alt="winner"
          src="/icons/winner.webp"
          className="conclusion__wins-img"
        />
      </div>
    ) : null;
  };

  const playWinnerSound = (phase: "round" | "game") => {
    const isGameWinner = phase === "game";

    const winnersNames = getWinnersNamesArray(
      desk.gameplay.rounds[desk.gameplay.current.round].winners
    );

    const isYouAmongWinners = winnersNames.includes(
      getStorageObjectItem(STORAGE_ITEMS.CREDENTIALS)?.name
    );

    if (isYouAmongWinners) {
      playAudio(isGameWinner ? "gameWin" : "roundWin");
    } else {
      playAudio(isGameWinner ? "gameLoose" : "roundLoose");
    }
  };

  useEffect(() => {
    if (!desk.gameplay.isShowConclusion) {
      return;
    }

    if (desk.gameplay.isLastRound) {
      playWinnerSound("game");
    } else {
      playWinnerSound("round");
    }
  }, [desk.gameplay]);

  const winTotals = getWinTotals(rounds);

  const winnersNames = getWinnersNamesString(
    rounds[desk.gameplay.current.round].winners
  );

  const title = `Winner${
    winnersNames.includes(", ") ? "s" : ""
  }: ${winnersNames}`;

  const rankings =
    rounds[desk.gameplay.current.round].stages[desk.gameplay.current.stage]
      .rankings;

  return (
    <Modal
      title={title}
      className="conclusion"
      isOpen={gameOpen[GAME_OPEN.CONCLUSION]}
    >
      <span className="conclusion__round">
        Round: {desk.gameplay.current.round + 1}
      </span>

      <div className="conclusion__pool">
        {rankings.map((ranking, index) => (
          <div key={index} className="conclusion__pool-ranking">
            <span className="conclusion__pool-player">
              {ranking.player.name}
            </span>
            <span className="conclusion__pool-name">{ranking.value.name}</span>
            <span className="conclusion__pool-wins">
              {getWinnerIcons(winTotals[ranking.player.name || ""])}
            </span>
          </div>
        ))}
      </div>
    </Modal>
  );
};
