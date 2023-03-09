import React, { useEffect, useState } from "react";
import { Cube } from "@components/Main/Cubes/Cube/Cube";
import { getRandomIntsFromInterval } from "@src/utils/helpers/randomizer.helper";
import { getRankingResult } from "@src/utils/helpers/ranking/ranking.helper";

export const Cubes = () => {
  const [cubes, setCubes] = useState<number[]>([]);

  useEffect(() => {
    handleSetRandomCubes();
  }, []);

  const handleSetRandomCubes = () => {
    setCubes(getRandomIntsFromInterval(5, [1, 6]));
  };

  const ranking = getRankingResult(cubes);

  const text = ranking.value.text;

  return (
    <div className="cubes-container">
      <div className="cubes">
        {cubes.map((cube, index) => (
          <Cube key={index} value={cube} />
        ))}
      </div>
      <span className="ranking-text" onClick={handleSetRandomCubes}>
        {text || " "}
      </span>
    </div>
  );
};
