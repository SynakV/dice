import { DICE } from "@src/utils/constants";
import React, { FC, useEffect, useState } from "react";
import { Cube } from "@src/components/Main/Game/Desk/Cubes/Cube/Cube";
import {
  USER,
  RoundType,
  ROUND_STAGE,
  RankingResultWithInfoType,
} from "@src/utils/types";
import {
  getRandomInt,
  getRandomIntsFromInterval,
} from "@src/utils/helpers/randomizer.helper";
import { playAudio } from "@src/utils/helpers/audio.helper";
import { getRankingResult } from "@src/utils/helpers/ranking/ranking.helper";

const DEFAULT_CUBES = new Array(DICE.COUNT).fill(null);

interface Props {
  forceRefresh: {} | null;
  round?: RoundType | null;
  user: USER.FIRST | USER.SECOND;
  setRankingResult: (result: RankingResultWithInfoType | null) => void;
}

export const Cubes: FC<Props> = ({
  user,
  round,
  forceRefresh,
  setRankingResult,
}) => {
  const [ranking, setRanking] = useState<any>(null);
  const [cubes, setCubes] = useState<number[] | null>(null);
  const [cubesReroll, setCubesReroll] =
    useState<(number | null)[]>(DEFAULT_CUBES);

  const isOtherUser = user !== USER.FIRST;

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
      setRankingResult({
        ...ranking,
        user,
        cubes: newCubes,
        stage: round?.stage?.value,
      });
    };
  };

  const handleReRollDice = (round: RoundType) => {
    if (!cubes) {
      return;
    }

    const newCubes: number[] = [];

    for (let i = 0; i < cubesReroll.length; i++) {
      newCubes.push(cubesReroll[i] ? cubesReroll[i]! : cubes[i]);
    }

    playAudio("handMixDice").onended = () => {
      setCubesReroll(DEFAULT_CUBES);
      handleSetCubes({ cubes: newCubes, round });
    };
  };

  const handleSetDieForReRoll = (value: number, index: number) => {
    if (round?.stage?.isCompleted?.[ROUND_STAGE.START]) {
      const copy = [...cubesReroll];
      if (copy[index]) {
        copy.splice(index, 1, null);
      } else {
        copy[index] = getRandomInt();
      }
      setCubesReroll(copy);
      playAudio("selectDieForReroll");
    }
  };

  useEffect(() => {
    if (!round) {
      return;
    }

    if (!round.stage?.isStart) {
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
        return handleRollDice(round);
      }
    }
  }, [round]);

  useEffect(() => {
    if (forceRefresh) {
      setCubes(null);
      setRanking(null);
      setCubesReroll(DEFAULT_CUBES);
    }
  }, [forceRefresh]);

  const handleRollDice = (round: RoundType) => {
    playAudio("handMixDice").onended = () => {
      handleSetCubes({ round });
    };
  };

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
            setDieForReRoll={(value) => handleSetDieForReRoll(value, index)}
          />
        ))}
      </div>
    </div>
  );
};
