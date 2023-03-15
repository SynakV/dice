import { Modal } from "@src/components/Modal/Modal";
import React, { FC, useEffect, useState } from "react";
import { playAudio } from "@src/utils/helpers/audio.helper";
import { ConclusionType, ROUND_STAGE, USER } from "@src/utils/types";
import { getGameWinner } from "@src/utils/helpers/ranking/ranking.helper";

interface Props {
  conclusion: ConclusionType;
  toggleHistoryOpen: () => void;
  setIsClearOnEnd: (isGameEnd: boolean) => void;
}

export const Conclusion: FC<Props> = ({
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

      setIsOpen(round?.stage === ROUND_STAGE.END);
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
    setIsClearOnEnd(isLastRound);
  };

  const isShow = !!(isOpen && round);

  return (
    <Modal title={getTitle()} isOpen={isShow}>
      <span className="conclusion__history" onClick={toggleHistoryOpen}>
        History
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
        <div className="conclusion__wins-count">
          {round?.winner?.[USER.FIRST] || <></>}
        </div>
        <div className="conclusion__wins-count">
          {round?.winner?.[USER.SECOND] || <></>}
        </div>
      </div>
      <div onClick={handleClick} className="conclusion__button">
        {isLastRound ? "Close" : "Continue"}
      </div>
    </Modal>
  );
};
