import { DICE } from "@utils/constants";
import React, { FC, useEffect, useState } from "react";
import { playAudio } from "@utils/helpers/audio.helper";
import { Cube } from "@components/Game/Desk/Cubes/Cube/Cube";
import { RankingResultType, PlayerType } from "@utils/common/types";
import { getRandomIntsFromInterval } from "@utils/helpers/randomizer.helper";
import {
  getRanking,
  getReRollIndexes,
} from "@utils/helpers/ranking/ranking.helper";
import { useDesk } from "@utils/contexts/DeskContext";
import { useGame } from "@utils/contexts/GameContext";
import { afterThrow } from "@utils/helpers/gameplay/gameplay.helper";
import {
  getCubesReroll,
  getDiceForReroll,
} from "@utils/helpers/gameplay/cubes.helper";
import { STORAGE_ITEMS } from "@utils/helpers/storage/constants";
import { getStorageObjectItem } from "@utils/helpers/storage/storage.helper";

const DEFAULT_CUBES = new Array(DICE.COUNT).fill(null);

interface Props {
  name?: string;
  player: PlayerType;
}

export const Cubes: FC<Props> = ({ player, name }) => {
  const { desk, setDesk } = useDesk();
  const { onRefreshGame } = useGame();
  const [ranking, setRanking] = useState<RankingResultType | null>(null);
  const [cubes, setCubes] = useState<number[] | null>(null);
  const [cubesReroll, setCubesReroll] =
    useState<(number | null)[]>(DEFAULT_CUBES);

  const isOtherPlayer =
    player.name !== getStorageObjectItem(STORAGE_ITEMS.CREDENTIALS)?.name;

  const round = desk.gameplay.rounds[desk.gameplay.current.round];
  const stage = round.stages[desk.gameplay.current.stage];

  const handleSetCubes = (cubes?: number[]) => {
    const newCubes = cubes || getRandomIntsFromInterval();
    const ranking = getRanking(newCubes);

    setCubes(newCubes);
    setRanking(ranking);

    playAudio("handThrowDice").onended = () => {
      setDesk((prev) =>
        afterThrow(prev, {
          ...ranking,
          player,
          cubes: newCubes,
          stage: desk.gameplay.current.stage,
        })
      );
    };
  };

  const handleRollDice = () => {
    playAudio("handMixDice").onended = () => {
      handleSetCubes();
    };
  };

  const handleReRollDice = (computerCubesReloll?: (number | null)[]) => {
    if (!cubes) {
      return;
    }

    playAudio("handMixDice").onended = () => {
      setCubesReroll(DEFAULT_CUBES);
      const newCubes = getDiceForReroll(
        cubes,
        cubesReroll,
        computerCubesReloll
      );
      handleSetCubes(newCubes);
    };
  };

  const handleSelectDie = (index: number | number[]) => {
    if (round?.stages?.[0]?.isCompleted) {
      const cubesForReroll = getCubesReroll(index, cubesReroll);
      setCubesReroll(cubesForReroll);

      return cubesForReroll;
    }
  };

  // Round flow
  useEffect(() => {
    const isCurrentPlayerTurn =
      desk.gameplay.current.player?.name === player.name;

    if (!stage.isStarted || stage.isCompleted || !isCurrentPlayerTurn) {
      return;
    }

    // FIRST STAGE (Roll)
    if (desk.gameplay.current.stage === 0) {
      handleRollDice();
    } else {
      if (isOtherPlayer && cubes && ranking) {
        const reRollIndexes = getReRollIndexes(cubes, ranking);
        const cubesReroll = handleSelectDie(reRollIndexes);
        return handleReRollDice(cubesReroll);
      }

      handleReRollDice();
    }
  }, [desk]);

  useEffect(() => {
    if (onRefreshGame) {
      setCubes(null);
      setRanking(null);
      setCubesReroll(DEFAULT_CUBES);
    }
  }, [onRefreshGame]);

  return (
    <div className="cubes">
      <span className="cubes__name">
        <span>{name}</span>
        <span>{ranking?.value?.name}</span>
      </span>
      <div className="cubes__container">
        {(cubes || DEFAULT_CUBES).map((cube, index) => (
          <Cube
            key={index}
            value={cube}
            isOtherPlayer={isOtherPlayer}
            isSelected={!!cubesReroll[index]}
            selectDie={() => handleSelectDie(index)}
          />
        ))}
      </div>
    </div>
  );
};
