import { DICE } from "@utils/constants";
import React, { FC, useEffect, useState } from "react";
import { playAudio } from "@utils/helpers/audio.helper";
import { Cube } from "@components/Mode/Offline/Game/Desk/Cubes/Cube/Cube";
import { RankingResultType, PlayerType } from "@utils/common/types";
import { getRandomIntsFromInterval } from "@utils/helpers/randomizer.helper";
import {
  getRanking,
  getReRollIndexes,
} from "@utils/helpers/ranking/ranking.helper";
import { useDesk } from "@utils/contexts/DeskContext";
import { useGame } from "@utils/contexts/GameContext";
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
  const { handle, desk } = useDesk();
  const { onRefreshGame } = useGame();
  const [temp, setTemp] = useState<{
    cubes: (number | null)[];
    ranking: RankingResultType;
  } | null>(null);
  const [cubesReroll, setCubesReroll] =
    useState<(number | null)[]>(DEFAULT_CUBES);

  const isOtherPlayer =
    player.name !== getStorageObjectItem(STORAGE_ITEMS.CREDENTIALS)?.name;

  const round = desk.gameplay.rounds[desk.gameplay.current.round];
  const stage = round.stages[desk.gameplay.current.stage];

  const ranking =
    // show current ranking
    stage.rankings.find((ranking) => ranking.player.name === player.name) ||
    // if no ranking, show ranking from previous stage
    round.stages[desk.gameplay.current.stage - 1]?.rankings.find(
      (ranking) => ranking.player.name === player.name
    ) ||
    // if no ranking, show ranking from last stage of previous round
    desk.gameplay.rounds[desk.gameplay.current.round - 1]?.stages
      .at(-1)
      ?.rankings.find((ranking) => ranking.player.name === player.name);

  const cubes = ranking?.cubes;

  const handleSetCubes = (cubes?: number[]) => {
    const newCubes = cubes || getRandomIntsFromInterval();
    const ranking = getRanking(newCubes);

    setTemp({
      ranking,
      cubes: newCubes,
    });

    playAudio("handThrowDice").onended = () => {
      handle.throwDice({
        ...ranking,
        player,
        cubes: newCubes,
        stage: desk.gameplay.current.stage,
      });
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
    setTemp(null);
  }, [stage]);

  useEffect(() => {
    if (onRefreshGame) {
      setCubesReroll(DEFAULT_CUBES);
    }
  }, [onRefreshGame]);

  return (
    <div className="cubes">
      <span className="cubes__name">
        <span>{name}</span>
        <span>{temp?.ranking?.value.name || ranking?.value?.name}</span>
      </span>
      <div className="cubes__container">
        {(temp?.cubes || cubes || DEFAULT_CUBES).map((cube, index) => (
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
