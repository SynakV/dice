import React, { FC, useEffect } from "react";
import { playAudio } from "@utils/helpers/audio.helper";
import { CubesType, PlayerType } from "@utils/common/types";
import { Cube } from "@components/Mode/Shared/Desk/Cube/Cube";
import {
  getNonRepeatedInt,
  getRandomIntsFromInterval,
} from "@utils/helpers/randomizer.helper";
import {
  getRanking,
  getReRollIndexes,
} from "@utils/helpers/ranking/ranking.helper";
import { useDesk } from "@utils/contexts/DeskContext";
import {
  DEFAULT_CUBES,
  getCubesReroll,
  getCurrentRanking,
  getDiceForReroll,
} from "@utils/helpers/gameplay/cubes.helper";
import { Row } from "@components/Mode/Shared/Desk/Row/Row";
import { STORAGE_ITEMS } from "@utils/helpers/storage/constants";
import { getStorageObjectItem } from "@utils/helpers/storage/storage.helper";

interface Props {
  player: PlayerType;
}

export const Cubes: FC<Props> = ({ player }) => {
  const { handle, desk } = useDesk();

  const isOtherPlayer =
    player.name !== getStorageObjectItem(STORAGE_ITEMS.CREDENTIALS)?.name;

  const isCurrentPlayerTurn =
    desk.gameplay.current.player?.name === player.name;

  const round = desk.gameplay.rounds[desk.gameplay.current.round];
  const stage = round.stages[desk.gameplay.current.stage];

  const ranking = getCurrentRanking(desk, player);
  const { roll, reroll } = ranking?.cubes || {};

  // Round flow
  useEffect(() => {
    if (!stage.isStarted || stage.isCompleted || !isCurrentPlayerTurn) {
      return;
    }

    // FIRST STAGE (Roll)
    if (desk.gameplay.current.stage === 0) {
      handleRollDice();
    }

    // LAST STAGE (Re-Roll)
    else {
      if (!isOtherPlayer) {
        return handleReRollDice();
      }

      if (isOtherPlayer && !reroll && ranking) {
        const reRollIndexes = getReRollIndexes(ranking);
        const cubesReroll = handleSelectDie(reRollIndexes);
        return handleReRollDice({ roll, reroll: cubesReroll });
      }
    }
  }, [desk]);

  const handleRollDice = () => {
    playAudio("handMixDice").onended = () => {
      handleSetRoll();
    };
  };

  const handleReRollDice = (cubes?: CubesType) => {
    if (!ranking) {
      return;
    }

    const newCubes = getDiceForReroll(cubes || ranking.cubes) || [];

    playAudio("handMixDice").onended = () => {
      handleSetRoll(newCubes);
    };
  };

  const handleSelectDie = (index: number | number[]) => {
    if (ranking?.cubes) {
      playAudio("selectDieForReroll");
      const selectedDice = getCubesReroll(index, ranking?.cubes);
      handle.selectDice(selectedDice);

      return selectedDice;
    }
  };

  const handleSetRoll = (roll?: number[]) => {
    const newCubes = roll || getRandomIntsFromInterval();
    const newRanking = getRanking(newCubes);

    handle.throwDice({
      ...newRanking,
      player,
      cubes: { roll: newCubes },
      stage: desk.gameplay.current.stage,
    });

    playAudio("handThrowDice").onended = () => {
      handle.finishThrowDice();
    };
  };

  const isDisableCube =
    isOtherPlayer ||
    !round.stages[0].isCompleted ||
    stage.isStarted ||
    stage.isPlayerThrew;

  const isRollAnimationNumber = stage.isStarted && isCurrentPlayerTurn;

  return (
    <Row player={player.name} ranking={ranking?.value.name}>
      {(roll || DEFAULT_CUBES).map((cube, index) => {
        const isAllowSelectedAnimation =
          !!reroll?.[index] || desk.gameplay.current.stage === 0;

        const rollAnimationNumber =
          isRollAnimationNumber &&
          isAllowSelectedAnimation &&
          getNonRepeatedInt(cube || 1);

        return (
          <Cube
            key={index}
            value={cube}
            isDisabled={isDisableCube}
            isSelected={!!reroll?.[index]}
            onClick={() => handleSelectDie(index)}
            rollAnimationNumber={rollAnimationNumber}
          />
        );
      })}
    </Row>
  );
};
