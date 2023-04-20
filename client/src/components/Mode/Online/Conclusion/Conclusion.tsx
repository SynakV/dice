import React, { useEffect } from "react";
import { useDesk } from "@utils/contexts/DeskContext";
import { Modal } from "@components/Shared/Modal/Modal";
import {
  getWinTotals,
  getWinnersNounString,
  getWinnersNamesString,
} from "@utils/helpers/ranking/ranking.helper";
import { Hand } from "@components/Mode/Shared/Desk/Hand/Hand";
import { Cube } from "@components/Mode/Shared/Desk/Cube/Cube";
import { GAME_OPEN, useGame } from "@utils/contexts/GameContext";
import {
  getWinnerIcons,
  playWinnerSound,
} from "@components/Mode/Shared/Conclusion/Conclusion";

export const Conclusion = () => {
  const {
    desk: {
      gameplay: { rounds, current, isShowConclusion, isLastRound },
    },
  } = useDesk();
  const { player, gameOpen } = useGame();

  const winners = rounds[current.round].winners;

  const winnersNames = getWinnersNamesString(winners);

  const isYouAmongWinners = !!winners.find(
    (winner) => winner.id === player?.id
  );

  useEffect(() => {
    if (!isShowConclusion) {
      return;
    }

    if (isLastRound) {
      playWinnerSound("game", isYouAmongWinners);
    } else {
      playWinnerSound("round", isYouAmongWinners);
    }
  }, [rounds]);

  const winTotals = getWinTotals(rounds);

  const title = getWinnersNounString(winnersNames);

  const rankings = rounds[current.round].stages[current.stage].rankings;

  return (
    <Modal
      title={title}
      className="conclusion"
      isOpen={gameOpen[GAME_OPEN.CONCLUSION]}
    >
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
            {getWinnerIcons(winTotals[ranking.player.id])}
          </Hand>
        ))}
      </div>
    </Modal>
  );
};
