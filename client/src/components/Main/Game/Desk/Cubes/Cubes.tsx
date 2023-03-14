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
import { getRankingResult } from "@src/utils/helpers/ranking/ranking.helper";

const DEFAULT_CUBES = new Array(DICE.COUNT).fill(null);

interface Props {
  stage?: ROUND_STAGE;
  forceRefresh: {} | null;
  round?: RoundType | null;
  user: USER.FIRST | USER.SECOND;
  setRankingResult: (result: RankingResultWithInfoType | null) => void;
}

export const Cubes: FC<Props> = ({
  user,
  stage,
  round,
  forceRefresh,
  setRankingResult,
}) => {
  const [ranking, setRanking] = useState<any>(null);
  const [cubes, setCubes] = useState<number[] | null>(null);
  const [cubesReroll, setCubesReroll] =
    useState<(number | null)[]>(DEFAULT_CUBES);

  const isOtherUser = user !== USER.FIRST;

  const handleSetRandomCubes = ({
    round,
    cubes,
  }: {
    round?: RoundType;
    cubes?: number[];
  }) => {
    const newCubes = cubes || getRandomIntsFromInterval();
    const ranking = getRankingResult(newCubes);

    setCubes(newCubes);
    setRanking(ranking);
    setRankingResult({
      ...ranking,
      user,
      cubes: newCubes,
      stage: round?.stage,
    });
  };

  const handleReRollDice = () => {
    if (!cubes) {
      return;
    }

    const newCubes = [];

    for (let i = 0; i < cubesReroll.length; i++) {
      newCubes.push(cubesReroll[i] ? cubesReroll[i]! : cubes[i]);
    }

    setCubesReroll(DEFAULT_CUBES);
    handleSetRandomCubes({ cubes: newCubes });
  };

  const handleSetDieForReRoll = (value: number, index: number) => {
    if (stage === ROUND_STAGE.START) {
      const copy = [...cubesReroll];
      if (copy[index]) {
        copy.splice(index, 1, null);
      } else {
        copy[index] = getRandomInt();
      }
      setCubesReroll(copy);
    }
  };

  useEffect(() => {
    if (round && !round.isCompleted) {
      handleSetRandomCubes({ round });
    }
  }, [round]);

  useEffect(() => {
    if (forceRefresh) {
      setCubes(null);
      setRanking(null);
      setCubesReroll(DEFAULT_CUBES);
    }
  }, [forceRefresh]);

  const text = ranking?.value?.name || <>&nbsp;</>;

  const isRoundStart = stage !== ROUND_STAGE.START;

  return (
    <div className="cubes">
      {!isOtherUser && (
        <span
          className="cubes__roll"
          onClick={
            isRoundStart
              ? () => handleSetRandomCubes({})
              : () => handleReRollDice()
          }
        >
          {isRoundStart ? "Roll" : "Re-roll"}
        </span>
      )}

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
