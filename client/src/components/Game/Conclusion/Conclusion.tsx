import Image from "next/image";
import React, { useEffect, useState } from "react";
import { USER, ROUND_STAGE } from "@utils/common/types";
import { useGame } from "@src/utils/contexts/GameContext";
import { useDesk } from "@src/utils/contexts/DeskContext";
import { Modal } from "@src/components/Shared/Modal/Modal";
import { playAudio } from "@src/utils/helpers/audio.helper";
import { getGameWinner } from "@src/utils/helpers/ranking/ranking.helper";

export const Conclusion = () => {
  const { desk, setDesk } = useDesk();
  const { toggleHistoryOpen } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  const [isLastRound, setIsLastRound] = useState(false);

  const getTitle = () => {
    switch (desk?.gameplay?.round?.winner?.current) {
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
    setDesk((prev) => ({
      ...prev,
      gameplay: {
        ...prev?.gameplay,
        round: {
          ...prev?.gameplay?.round,
          value: (prev?.gameplay?.round?.value || 0) + 1,
          isCompleted: false,
          stage: {},
          status: "",
        },
      },
    }));
  };

  useEffect(() => {
    if (desk?.gameplay?.round) {
      const gameWinner = getGameWinner(desk?.gameplay?.round);

      if (gameWinner !== false) {
        setIsLastRound(true);
        playWinnerSound("game");
      } else {
        setIsLastRound(false);
        playWinnerSound("round");
      }

      const isRoundNotNull = !!desk?.gameplay?.round;
      const isNextRoundDidntStartYet = !desk?.gameplay?.round?.stage?.isStart;
      const isLastRoundStage =
        desk?.gameplay?.round?.stage?.value === ROUND_STAGE.END;

      setIsOpen(isLastRoundStage && isNextRoundDidntStartYet && isRoundNotNull);
    }
  }, [desk?.gameplay?.round]);

  const playWinnerSound = (phase: "round" | "game") => {
    if (
      !desk?.gameplay?.round?.winner?.current ||
      !desk?.gameplay?.round?.isCompleted
    ) {
      return;
    }

    const isGameWinner = phase === "game";

    if (desk?.gameplay?.round?.winner?.current === USER.FIRST) {
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
      setDesk((prev) => ({
        ...prev,
        gameplay: {
          ...prev?.gameplay,
          isGameEnded: isLastRound,
        },
      }));
    }, 300);
  };

  const getRankingName = (user: USER.FIRST | USER.SECOND) =>
    desk?.gameplay?.history?.[desk?.gameplay?.round?.value || 0]?.[
      desk?.gameplay?.round?.stage?.value || 0
    ]?.result?.[user]?.value.name;

  return (
    <Modal title={getTitle()} isOpen={isOpen}>
      <span className="conclusion__round">
        Round: {(desk?.gameplay?.round?.value || 0) + 1}
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
        {getWinnerIcons(desk?.gameplay?.round?.winner?.[USER.FIRST])}
        {getWinnerIcons(desk?.gameplay?.round?.winner?.[USER.SECOND])}
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
