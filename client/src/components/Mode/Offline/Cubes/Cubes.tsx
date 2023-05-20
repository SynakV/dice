import Image from "next/image";
import React, { FC, useEffect } from "react";
import { playAudio } from "@utils/helpers/audio.helper";
import { CubesType, PlayerType } from "@utils/common/types";
import { Cube } from "@components/Mode/Shared/Desk/Cube/Cube";
import {
  getNonEqualInt,
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
  getDiceForReroll,
  getCurrentRanking,
} from "@utils/helpers/gameplay/cubes.helper";
import { useGame } from "@utils/contexts/GameContext";
import { Hand } from "@components/Mode/Shared/Hand/Hand";
import { useCursor } from "@utils/contexts/CursorProvider";

interface Props {
  player: PlayerType;
}

export const Cubes: FC<Props> = ({ player }) => {
  const Cursor = useCursor();
  const { player: you } = useGame();
  const { handle, desk } = useDesk();

  const isOtherPlayer = player.id !== you?.id;

  const isCurrentPlayerTurn = desk.gameplay.current.player?.id === player.id;

  const round = desk.gameplay.rounds[desk.gameplay.current.round];
  const stage = round.stages[desk.gameplay.current.stage];

  const ranking = getCurrentRanking(desk, player);
  const { roll, reroll } = ranking?.cubes || {};

  const isOtherPlayerThinkingToReroll =
    isOtherPlayer &&
    !stage.isStarted &&
    !stage.isPlayerThrew &&
    isCurrentPlayerTurn &&
    desk.gameplay.current.stage !== 0;

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

  // Computer thinking to re-roll or pass
  useEffect(() => {
    if (!isOtherPlayerThinkingToReroll || !ranking) {
      return;
    }

    const reRollIndexes = getReRollIndexes(ranking);

    playAudio("playerThinking").onended = () => {
      if (reRollIndexes.length) {
        handle.startThrowDice();
      } else {
        handle.passThrowDice();
      }
    };
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
    !isCurrentPlayerTurn ||
    isOtherPlayer ||
    !round.stages[0].isCompleted ||
    stage.isStarted ||
    stage.isPlayerThrew;

  const isRollAnimationNumber = stage.isStarted && isCurrentPlayerTurn;

  const isHighlightPlayer =
    isCurrentPlayerTurn && !desk.gameplay.isShowConclusion;

  return (
    <Hand
      player={player.name}
      ranking={ranking?.value.name}
      className={`${isHighlightPlayer ? "hand--highlight" : ""}`}
    >
      <Image
        fill
        alt="grunge-rect"
        className="hand__rect"
        src="/images/grunge-rect.png"
      />
      {(roll || DEFAULT_CUBES).map((cube, index) => {
        const isAllowSelectedAnimation =
          !!reroll?.[index] || desk.gameplay.current.stage === 0;

        const rollAnimationNumber =
          isRollAnimationNumber &&
          isAllowSelectedAnimation &&
          getNonEqualInt(cube || 1);

        return (
          <Cube
            key={index}
            value={cube}
            index={index}
            isDisabled={isDisableCube}
            isSelected={!!reroll?.[index]}
            Cursor={isOtherPlayer ? null : Cursor}
            onClick={() => handleSelectDie(index)}
            rollAnimationNumber={rollAnimationNumber}
          />
        );
      })}
    </Hand>
  );
};
