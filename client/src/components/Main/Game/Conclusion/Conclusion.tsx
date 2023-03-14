import { Modal } from "@src/components/Modal/Modal";
import React, { FC, useEffect, useState } from "react";
import { ConclusionType, ROUND_STAGE, USER } from "@src/utils/types";
import { getGameWinner } from "@src/utils/helpers/ranking/ranking.helper";

interface Props {
  conclusion: ConclusionType;
  setIsClearOnEnd: (isGameEnd: boolean) => void;
}

export const Conclusion: FC<Props> = ({
  conclusion: { result, round },
  setIsClearOnEnd,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGameEnd, setIsGameEnd] = useState(false);

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

      setIsGameEnd(gameWinner !== false);
      setIsOpen(round?.stage === ROUND_STAGE.END);
    }
  }, [round]);

  const handleClick = () => {
    setIsOpen(false);
    setIsClearOnEnd(isGameEnd);
  };

  const isShow = !!(isOpen && round);

  return (
    <Modal title={getTitle()} isOpen={isShow}>
      <div className="conclusion__pool">
        <div className="conclusion__pool-ranking">
          {result?.[USER.FIRST].value.name}
        </div>
        <span className="conclusion__pool-header">Pool</span>
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
        {isGameEnd ? "Close" : "Continue"}
      </div>
    </Modal>
  );
};
