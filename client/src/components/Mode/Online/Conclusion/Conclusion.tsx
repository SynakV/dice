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
  getWinnersNounString,
  getWinnersNamesString,
} from "@utils/helpers/ranking/ranking.helper";
import { Hand } from "@components/Mode/Shared/Desk/Hand/Hand";
import { Cube } from "@components/Mode/Shared/Desk/Cube/Cube";
import { GAME_OPEN, useGame } from "@utils/contexts/GameContext";

export const Conclusion = () => {
  const { desk } = useDesk();
  const { gameOpen } = useGame();

  const rounds = desk.gameplay.rounds;

  const getWinnerIcons = (wins: number = 0) => {
    return wins > 0 ? (
      <div className="hand__wins">
        <span className="hand__wins-counter">{wins}</span>
        <Image
          width={125}
          height={125}
          alt="winner"
          src="/icons/winner.webp"
          className="hand__wins-img"
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

  const title = getWinnersNounString(winnersNames);

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
    </Modal>
  );
};
