import { DICE } from "@src/utils/constants";
import React, { FC, useEffect, useState } from "react";
import { Cube } from "@src/components/Game/Desk/Cubes/Cube/Cube";
import {
  USER,
  RoundType,
  ROUND_STAGE,
  RankingResultType,
  RankingResultWithInfoType,
} from "@utils/common/types";
import { getRandomIntsFromInterval } from "@src/utils/helpers/randomizer.helper";
import { playAudio } from "@src/utils/helpers/audio.helper";
import {
  getRankingResult,
  getReRollIndexes,
} from "@src/utils/helpers/ranking/ranking.helper";
import { useDesk } from "@src/utils/contexts/DeskContext";
import {
  afterFirstThrew,
  afterSecondThrew,
} from "@src/utils/helpers/gameplay/gameplay.helper";
import { useGame } from "@src/utils/contexts/GameContext";
import {
  getCubesReroll,
  getDiceForReroll,
} from "@src/utils/helpers/gameplay/cubes.helper";

const DEFAULT_CUBES = new Array(DICE.COUNT).fill(null);

interface Props {
  user: USER.FIRST | USER.SECOND;
}

export const Cubes: FC<Props> = ({ user }) => {
  const { desk, setDesk } = useDesk();
  const { onRefreshGame } = useGame();
  const [ranking, setRanking] = useState<RankingResultType | null>(null);
  const [cubes, setCubes] = useState<number[] | null>(null);
  const [cubesReroll, setCubesReroll] =
    useState<(number | null)[]>(DEFAULT_CUBES);

  const round = desk?.gameplay?.round;

  const isOtherUser = user !== USER.FIRST;

  const handleThrow = (result: RankingResultWithInfoType | null) => {
    if (!result) {
      return;
    }

    if (result.user === USER.FIRST) {
      setDesk((prev) => afterFirstThrew(prev, result));
    }

    if (result.user === USER.SECOND) {
      setDesk((prev) => afterSecondThrew(prev, result));
    }
  };

  const handleSetCubes = ({
    round,
    cubes,
  }: {
    round: RoundType;
    cubes?: number[];
  }) => {
    const newCubes = cubes || getRandomIntsFromInterval();
    const ranking = getRankingResult(newCubes);

    setCubes(newCubes);
    setRanking(ranking);

    playAudio("handThrowDice").onended = () => {
      handleThrow({
        ...ranking,
        user,
        cubes: newCubes,
        stage: round?.stage?.value,
      });
    };
  };

  const handleRollDice = (round: RoundType) => {
    playAudio("handMixDice").onended = () => {
      handleSetCubes({ round });
    };
  };

  const handleReRollDice = (
    round: RoundType,
    computerCubesReloll?: (number | null)[]
  ) => {
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
      handleSetCubes({ cubes: newCubes, round });
    };
  };

  const handleSetDieForReRoll = (index: number | number[]) => {
    if (round?.stage?.isCompleted?.[ROUND_STAGE.START]) {
      const cubesForReroll = getCubesReroll(index, cubesReroll);
      setCubesReroll(cubesForReroll);

      return cubesForReroll;
    }
  };

  // Round flow
  useEffect(() => {
    if (!round?.stage?.isStart) {
      return;
    }

    // STAGE 1 (Roll)
    if (!round.stage?.isCompleted?.[ROUND_STAGE.START]) {
      if (user === USER.FIRST && !round.stage?.threw?.[USER.FIRST]) {
        return handleRollDice(round);
      }

      if (user === USER.SECOND && round.stage?.threw?.[USER.FIRST]) {
        return handleRollDice(round);
      }
    }

    // STAGE 2 (Re-roll)
    if (
      round.stage?.value === ROUND_STAGE.END &&
      !round.stage.isCompleted?.[ROUND_STAGE.END]
    ) {
      if (user === USER.FIRST && !round.stage?.threw?.[USER.FIRST]) {
        return handleReRollDice(round);
      }

      if (user === USER.SECOND && round.stage?.threw?.[USER.FIRST]) {
        // If you want to disable decision-making algorithm, comment out condition below
        if (cubes && ranking) {
          const reRollIndexes = getReRollIndexes(cubes, ranking);
          const cubesReroll = handleSetDieForReRoll(reRollIndexes);
          return handleReRollDice(round, cubesReroll);
        }
        // return handleRollDice(round);
      }
    }
  }, [round]);

  useEffect(() => {
    if (onRefreshGame) {
      setCubes(null);
      setRanking(null);
      setCubesReroll(DEFAULT_CUBES);
    }
  }, [onRefreshGame]);

  const text = ranking?.value?.name || <>&nbsp;</>;

  return (
    <div className="cubes">
      <div className="cubes__container">
        {(cubes || DEFAULT_CUBES).map((cube, index) => (
          <Cube
            key={index}
            value={cube}
            isOtherUser={isOtherUser}
            isSelected={!!cubesReroll[index]}
            setDieForReRoll={() => handleSetDieForReRoll(index)}
          />
        ))}
      </div>
    </div>
  );
};
