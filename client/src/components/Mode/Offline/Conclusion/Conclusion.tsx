import React, { useEffect, useState } from "react";
import { useDesk } from "@utils/contexts/DeskContext";
import { Modal } from "@components/Shared/Modal/Modal";
import { playAudio } from "@utils/helpers/audio.helper";
import { GAME_OPEN, useGame } from "@utils/contexts/GameContext";
import {
  getWinTotals,
  getGameWinner,
  getWinnersNounString,
  getWinnersNamesString,
} from "@utils/helpers/ranking/ranking.helper";
import { TIMEOUT_TRANSITION } from "@utils/constants";
import { Hand } from "@components/Mode/Shared/Desk/Hand/Hand";
import { Cube } from "@components/Mode/Shared/Desk/Cube/Cube";
import {
  getWinnerIcons,
  playWinnerSound,
} from "@components/Mode/Shared/Conclusion/Conclusion";

export const Conclusion = () => {
  const {
    handle,
    desk: {
      gameplay: { rounds, current, max },
    },
  } = useDesk();
  const { player, toggleGameOpen } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  const [isLastRound, setIsLastRound] = useState(false);

  const winners = rounds[current.round].winners;

  const winnersNames = getWinnersNamesString(winners);

  const isYouAmongWinners = !!winners.find(
    (winner) => winner.id === player?.id
  );

  useEffect(() => {
    const isRoundComplete = rounds[current.round].isCompleted;

    if (isRoundComplete) {
      const gameWinner = getGameWinner(rounds, max.wins);

      if (gameWinner !== false) {
        setIsLastRound(true);
        playWinnerSound("game", isYouAmongWinners);
      } else {
        setIsLastRound(false);
        playWinnerSound("round", isYouAmongWinners);
      }

      setIsOpen(true);
    }
  }, [rounds]);

  const handleClick = () => {
    setIsOpen(false);
    playAudio("hover");

    setTimeout(() => {
      handle.closeConclusion(isLastRound);
    }, TIMEOUT_TRANSITION);
  };

  const winTotals = getWinTotals(rounds);

  const title = getWinnersNounString(winnersNames);

  const rankings = rounds[current.round].stages[current.stage].rankings;

  return (
    <Modal className="conclusion" title={title} isOpen={isOpen}>
      <span className="conclusion__round">Round: {current.round + 1}</span>

      <div className="conclusion__hands">
        {rankings.map((ranking, index) => (
          <Hand
            key={index}
            player={ranking.player.name}
            ranking={ranking.value.name}
          >
            {ranking.cubes.roll?.map((cube, index) => (
              <Cube isDisabled key={index} value={cube} isSelected={false} />
            ))}
            {getWinnerIcons(winTotals[ranking.player.name || ""])}
          </Hand>
        ))}
      </div>
      <span onClick={handleClick} className="conclusion__button">
        {isLastRound ? "Close" : "Next round"}
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
