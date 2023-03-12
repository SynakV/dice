import React, { FC, useEffect, useState } from "react";
import { RANKING_OF_HANDS } from "@src/utils/constants";
import { Cube } from "@src/components/Main/Desk/Cubes/Cube/Cube";
import {
  USER,
  RoundType,
  RankingResultWithStageAndUserType,
} from "@src/utils/types";
import { getRankingResult } from "@src/utils/helpers/ranking/ranking.helper";
import { getRandomIntsFromInterval } from "@src/utils/helpers/randomizer.helper";

interface Props {
  round?: RoundType | null;
  user: USER.FIRST | USER.SECOND;
  setRankingResult: (result: RankingResultWithStageAndUserType | null) => void;
}

export const Cubes: FC<Props> = ({ user, round, setRankingResult }) => {
  const [ranking, setRanking] = useState<any>(null);
  const [cubes, setCubes] = useState<number[] | null>(null);

  const isOtherUser = round !== undefined;

  const handleSetRandomCubes = (round?: RoundType) => {
    const newCubes = getRandomIntsFromInterval(5, [1, 6]);
    const ranking = getRankingResult(newCubes);

    setCubes(newCubes);
    setRanking(ranking);
    setRankingResult({ ...ranking, stage: round?.stage, user });
  };

  const handleSetdieForReRoll = (value: number, index: number) => {
    // TODO
  };

  useEffect(() => {
    if (round && !round.isCompleted && round?.winner?.value !== null) {
      handleSetRandomCubes(round);
    }
  }, [round]);

  const text = ranking?.value?.text || RANKING_OF_HANDS.nothing.text;

  return (
    <div className="cubes-container">
      <span
        className="ranking-text"
        onClick={isOtherUser ? () => {} : () => handleSetRandomCubes()}
      >
        {text}
      </span>
      <div className="cubes">
        {(cubes || new Array(5).fill(null)).map((cube, index) => (
          <Cube
            key={index}
            value={cube}
            isOtherUser={isOtherUser}
            setDieForReRoll={(value) => handleSetdieForReRoll(value, index)}
          />
        ))}
      </div>
    </div>
  );
};
