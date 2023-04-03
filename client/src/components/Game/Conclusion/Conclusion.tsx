import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDesk } from "@utils/contexts/DeskContext";
import { Modal } from "@components/Shared/Modal/Modal";
import { playAudio } from "@utils/helpers/audio.helper";
import { STORAGE_ITEMS } from "@utils/helpers/storage/constants";
import { GAME_OPEN, useGame } from "@utils/contexts/GameContext";
import { getStorageObjectItem } from "@utils/helpers/storage/storage.helper";
import { afterConclusionClose } from "@utils/helpers/gameplay/gameplay.helper";
import {
  getWinTotals,
  getGameWinner,
  getWinnersNamesArray,
  getWinnersNamesString,
} from "@utils/helpers/ranking/ranking.helper";

export const Conclusion = () => {
  const { desk, setDesk } = useDesk();
  const { toggleGameOpen } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  const [isLastRound, setIsLastRound] = useState(false);

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

    const isYouAmongWinners = winnersNames?.includes(
      getStorageObjectItem(STORAGE_ITEMS.CREDENTIALS)?.name
    );

    if (isYouAmongWinners) {
      playAudio(isGameWinner ? "gameWin" : "roundWin");
    } else {
      playAudio(isGameWinner ? "gameLoose" : "roundLoose");
    }
  };

  useEffect(() => {
    const isRoundComplete =
      desk.gameplay.rounds[desk.gameplay.current.round].isCompleted;

    if (isRoundComplete) {
      const gameWinner = getGameWinner(
        desk.gameplay.rounds,
        desk.gameplay.max.wins
      );

      if (gameWinner !== false) {
        setIsLastRound(true);
        playWinnerSound("game");
      } else {
        setIsLastRound(false);
        playWinnerSound("round");
      }

      setIsOpen(true);
    }
  }, [desk]);

  const handleClick = () => {
    setIsOpen(false);
    playAudio("hover");

    setTimeout(() => {
      setDesk((prev) => afterConclusionClose(prev, isLastRound));
    }, 300);
  };

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
    <Modal title={title} isOpen={isOpen}>
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
              {getWinnerIcons(winTotals[ranking.player.name])}
            </span>
          </div>
        ))}
      </div>
      <span onClick={handleClick} className="conclusion__button">
        {isLastRound ? "Close" : "Continue"}
      </span>
      <span
        className="conclusion__history"
        onClick={() => toggleGameOpen(GAME_OPEN.HISTORY)}
      >
        History
      </span>
    </Modal>
  );
};
