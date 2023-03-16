import Image from "next/image";
import { Modal } from "@src/components/Modal/Modal";
import React, { FC, useEffect, useState } from "react";
import { playAudio } from "@src/utils/helpers/audio.helper";
import {
  USER,
  UpdateType,
  ROUND_STAGE,
  ConclusionType,
} from "@src/utils/types";
import { getGameWinner } from "@src/utils/helpers/ranking/ranking.helper";

interface Props {
  update: UpdateType | null;
  conclusion: ConclusionType;
  toggleHistoryOpen: () => void;
  setUpdate: (update: UpdateType) => void;
  setIsClearOnEnd: (isGameEnd: boolean) => void;
}

export const Conclusion: FC<Props> = ({
  update,
  setUpdate,
  setIsClearOnEnd,
  toggleHistoryOpen,
  conclusion: { result, round },
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLastRound, setIsLastRound] = useState(false);

  const getTitle = () => {
    if (round?.winner?.current === USER.FIRST) {
      return "You win!";
    } else {
      return "You loose!";
    }
  };

  const getWinnerIcons = (winns: number = 0) => {
    return (
      <div
        className={`conclusion__wins-count
           conclusion__wins-count--${winns > 1 ? "two" : ""}`}
      >
        {new Array(winns).fill(null).map((_, index) => (
          <Image
            key={index}
            width={100}
            height={100}
            alt="winner"
            src="/icons/winner.webp"
            className={`conclusion__wins-img 
              conclusion__wins-img--${index + 1}`}
          />
        ))}
      </div>
    );
  };

  const handleSetUpdate = () => {
    setUpdate({
      ...update,
      round: {
        ...round,
        value: (round?.value || 0) + 1,
        isCompleted: false,
        stage: {},
      },
    });
  };

  useEffect(() => {
    if (round) {
      const gameWinner = getGameWinner(round);

      if (gameWinner !== false) {
        setIsLastRound(true);
        playWinnerSound("game");
      } else {
        setIsLastRound(false);
        playWinnerSound("round");
      }

      setIsOpen(round?.stage?.value === ROUND_STAGE.END);
    }
  }, [round]);

  const playWinnerSound = (phase: "round" | "game") => {
    if (!round?.winner?.current || !round?.isCompleted) {
      return;
    }

    const isGameWinner = phase === "game";

    if (round?.winner?.current === USER.FIRST) {
      playAudio(isGameWinner ? "gameWin" : "roundWin");
    } else {
      playAudio(isGameWinner ? "gameLoose" : "roundLoose");
    }
  };

  const handleClick = () => {
    setIsOpen(false);
    handleSetUpdate();
    playAudio("hover");
    setIsClearOnEnd(isLastRound);
  };

  const isShow = !!(isOpen && round);

  return (
    <Modal title={getTitle()} isOpen={isShow}>
      <span className="conclusion__round">
        Round: {(round?.value || 0) + 1}
      </span>

      <div className="conclusion__pool">
        <div className="conclusion__pool-ranking">
          {result?.[USER.FIRST].value.name}
        </div>
        <span className="conclusion__pool-header"></span>
        <div className="conclusion__pool-ranking">
          {result?.[USER.SECOND].value.name}
        </div>
      </div>
      <div className="conclusion__wins">
        {getWinnerIcons(round?.winner?.[USER.FIRST])}
        {getWinnerIcons(round?.winner?.[USER.SECOND])}
      </div>
      <span onClick={handleClick} className="conclusion__button">
        {isLastRound ? "Close" : "Continue"}
      </span>
      <span className="conclusion__history" onClick={toggleHistoryOpen}>
        History
      </span>
    </Modal>
  );
};
