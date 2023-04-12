import { DICE } from "@utils/constants";
import { PlayerType } from "@utils/common/types";
import React, { FC, useEffect, useState } from "react";
import { playAudio } from "@utils/helpers/audio.helper";
import { Cube } from "@components/Mode/Online/Game/Desk/Cubes/Cube/Cube";
import { getRandomIntsFromInterval } from "@utils/helpers/randomizer.helper";
import {
  getRanking,
  getReRollIndexes,
} from "@utils/helpers/ranking/ranking.helper";
import { useDesk } from "@utils/contexts/DeskContext";
import {
  getCubesReroll,
  getCurrentRanking,
  getDiceForReroll,
} from "@utils/helpers/gameplay/cubes.helper";
import { STORAGE_ITEMS } from "@utils/helpers/storage/constants";
import { getStorageObjectItem } from "@utils/helpers/storage/storage.helper";

const DEFAULT_CUBES = new Array(DICE.COUNT).fill(null);

interface Props {
  name: string;
  player: PlayerType;
}

export const Cubes: FC<Props> = ({ player, name }) => {
  const { handle, desk } = useDesk();
  const [cubesReroll, setCubesReroll] =
    useState<(number | null)[]>(DEFAULT_CUBES);

  const isOtherPlayer =
    player.name !== getStorageObjectItem(STORAGE_ITEMS.CREDENTIALS)?.name;

  const isCurrentPlayerTurn =
    desk.gameplay.current.player?.name === player.name;

  const round = desk.gameplay.rounds[desk.gameplay.current.round];
  const stage = round.stages[desk.gameplay.current.stage];

  const ranking = getCurrentRanking(desk, player);
  const cubes = ranking?.cubes;

  const handleSetCubes = (cubes?: number[]) => {
    const newCubes = cubes || getRandomIntsFromInterval();
    const ranking = getRanking(newCubes);

    handle.throwDice({
      ...ranking,
      player,
      cubes: newCubes,
      stage: desk.gameplay.current.stage,
    });

    playAudio("handThrowDice", true).onended = () => {
      handle.finishStage();
    };
  };

  const handleRollDice = () => {
    playAudio("handMixDice", true).onended = () => {
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
    if (round.stages[0].isCompleted) {
      const cubesForReroll = getCubesReroll(index, cubesReroll);
      setCubesReroll(cubesForReroll);

      return cubesForReroll;
    }
  };

  // Round flow
  useEffect(() => {
    if (
      !stage.isStarted ||
      stage.isCompleted ||
      !isCurrentPlayerTurn ||
      isOtherPlayer
    ) {
      return;
    }

    if (desk.gameplay.current.stage === 0) {
      // FIRST STAGE (Roll)
      handleRollDice();
    } else {
      // LAST STAGE (Re-Roll)
      if (isOtherPlayer && cubes && ranking) {
        const reRollIndexes = getReRollIndexes(cubes, ranking);
        const cubesReroll = handleSelectDie(reRollIndexes);
        return handleReRollDice(cubesReroll);
      }

      handleReRollDice();
    }
  }, [desk]);

  useEffect(() => {
    if (!desk.gameplay.isGameStarted) {
      setCubesReroll(DEFAULT_CUBES);
    }
  }, [desk.gameplay.isGameStarted]);

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
            isCurrentPlayerTurn={isCurrentPlayerTurn}
          />
        ))}
      </div>
    </div>
  );
};
