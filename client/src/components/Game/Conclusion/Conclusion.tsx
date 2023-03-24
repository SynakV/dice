import Image from "next/image";
import { Modal } from "@src/components/Modal/Modal";
import React, { FC, useEffect, useState } from "react";
import { playAudio } from "@src/utils/helpers/audio.helper";
import { USER, ROUND_STAGE, GameplayType } from "@utils/common/types";
import { getGameWinner } from "@src/utils/helpers/ranking/ranking.helper";

interface Props {
  gameplay: GameplayType;
  toggleHistoryOpen: () => void;
  setGameplay: (gameplay: React.SetStateAction<GameplayType>) => void;
}

export const Conclusion: FC<Props> = ({
  setGameplay,
  toggleHistoryOpen,
  gameplay: { round, history },
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLastRound, setIsLastRound] = useState(false);

  const getTitle = () => {
    switch (round?.winner?.current) {
      case USER.FIRST:
        return "You win!";
      case USER.SECOND:
        return "You loose!";
      case USER.NOBODY:
        return "Draw!";
      default:
        return "";
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

  const handleUpdateGameplay = () => {
    setGameplay((prev) => ({
      ...prev,
      round: {
        ...prev?.round,
        value: (round?.value || 0) + 1,
        isCompleted: false,
        stage: {},
        status: "",
      },
    }));
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

      const isRoundNotNull = !!round;
      const isNextRoundDidntStartYet = !round?.stage?.isStart;
      const isLastRoundStage = round?.stage?.value === ROUND_STAGE.END;

      setIsOpen(isLastRoundStage && isNextRoundDidntStartYet && isRoundNotNull);
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
    playAudio("hover");

    setTimeout(() => {
      handleUpdateGameplay();
      setGameplay((prev) => ({
        ...prev,
        isGameEnded: isLastRound,
      }));
    }, 300);
  };

  const getRankingName = (user: USER.FIRST | USER.SECOND) =>
    history?.[round?.value || 0]?.[round?.stage?.value || 0]?.result?.[user]
      ?.value.name;

  return (
    <Modal title={getTitle()} isOpen={isOpen}>
      <span className="conclusion__round">
        Round: {(round?.value || 0) + 1}
      </span>

      <div className="conclusion__pool">
        <div className="conclusion__pool-ranking">
          {getRankingName(USER.FIRST)}
        </div>
        <span className="conclusion__pool-header"></span>
        <div className="conclusion__pool-ranking">
          {getRankingName(USER.SECOND)}
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
