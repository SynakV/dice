import React, { FC, useEffect, useState } from "react";
import { Cube } from "@components/Main/Cubes/Cube/Cube";
import { getRankingResult } from "@src/utils/helpers/ranking/ranking.helper";
import { getRandomIntsFromInterval } from "@src/utils/helpers/randomizer.helper";

interface Props {
  testCubes?: number[];
  setRankingResult: (result: any) => void;
}

export const Cubes: FC<Props> = ({ testCubes, setRankingResult }) => {
  const [cubes, setCubes] = useState<number[]>([]);
  const [ranking, setRanking] = useState<any>({});

  // useEffect(() => {
  //   handleSetRandomCubes();
  // }, []);

  const handleSetRandomCubes = () => {
    setCubes(getRandomIntsFromInterval(5, [1, 6]));
  };

  // useEffect(() => {
  //   if (cubes.length) {
  //     const ranking = getRankingResult(cubes);

  //     setRanking(ranking);
  //     setRankingResult(ranking);
  //   }
  // }, [cubes]);

  useEffect(() => {
    if (testCubes?.length) {
      const ranking = getRankingResult(testCubes);

      setRanking(ranking);
      setRankingResult(ranking);
    }
  }, [testCubes]);

  const text = ranking?.value?.text;

  return (
    <div className="cubes-container">
      <div className="cubes">
        {(testCubes || cubes).map((cube, index) => (
          <Cube key={index} value={cube} />
        ))}
      </div>
      <span className="ranking-text" onClick={handleSetRandomCubes}>
        {text || " "}
      </span>
    </div>
  );
};
