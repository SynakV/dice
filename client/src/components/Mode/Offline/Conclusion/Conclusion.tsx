import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDesk } from "@utils/contexts/DeskContext";
import { Modal } from "@components/Shared/Modal/Modal";
import { GAME_OPEN, useGame } from "@utils/contexts/GameContext";
import {
  getWinTotals,
  getGameWinner,
  getWinnersNounString,
  getWinnersNamesString,
} from "@utils/helpers/ranking/ranking.helper";
import { TIMEOUT_TRANSITION } from "@utils/constants";
import { Hand } from "@components/Mode/Shared/Hand/Hand";
import { Cube } from "@components/Mode/Shared/Desk/Cube/Cube";
import {
  getWinnerIcons,
  playWinnerSound,
} from "@components/Mode/Shared/Conclusion/Conclusion";
import { useCursor } from "@utils/contexts/CursorProvider";
import { playSound, useMedia } from "@utils/contexts/MediaProvider";

export const Conclusion = () => {
  const {
    handle,
    desk: {
      gameplay: { rounds, current, max },
    },
  } = useDesk();
  const Cursor = useCursor();
  const { playMusic, playVideo } = useMedia();
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

  const handleNextRound = () => {
    setIsOpen(false);
    playSound("hover");

    if (isLastRound) {
      playMusic({ name: "Striga", isSwitchInPage: true, switchDuration: 1000 });

      playVideo({
        name: "Intro",
        isSwitchInPage: true,
        videoFadeDuraion: 1000,
      });
    }

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
            {getWinnerIcons(
              winTotals[ranking.player.id],
              !!winners.find((winner) => winner.id === ranking.player.id)
            )}
          </Hand>
        ))}
      </div>
      <div className="modal__footer">
        <Cursor id="conclusion-history" position="bottom" hint="History">
          <span
            className="conclusion__history"
            onClick={() => toggleGameOpen(GAME_OPEN.HISTORY)}
          >
            History
          </span>
        </Cursor>
        <Cursor
          position="bottom"
          id="conclusion-close"
          hint={isLastRound ? "Close" : "Next round"}
        >
          <Image
            height={30}
            onClick={handleNextRound}
            width={isLastRound ? 30 : 50}
            className="conclusion__button"
            alt={`${isLastRound ? "grunge-cross" : "grunge-arrow-right"}`}
            src={`/images/${
              isLastRound ? "grunge-cross" : "grunge-arrow-right"
            }.png`}
          />
        </Cursor>
      </div>
    </Modal>
  );
};
