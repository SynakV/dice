import { USER } from "@src/utils/types";
import React, { useEffect, useState } from "react";
import { Cubes } from "@components/Main/Cubes/Cubes";
import { getWinner } from "@src/utils/helpers/ranking/ranking.helper";
import { getRandomIntsFromInterval } from "@src/utils/helpers/randomizer.helper";

export const Main = () => {
  const [testCubes1, setTestCubes1] = useState<any>([1, 2, 3, 4, 6]);
  const [testCubes2, setTestCubes2] = useState<any>([1, 2, 3, 4, 6]);
  const [result1, setresult1] = useState<any>(null);
  const [result2, setresult2] = useState<any>(null);
  const [winner, setWinner] = useState<any>(0);

  useEffect(() => {
    if (result1 && result2) {
      setWinner(getWinner(result1, result2));
    }
  }, [result1, result2]);

  const handleReRoll = () => {
    setTestCubes1(getRandomIntsFromInterval(5, [1, 6]));
    setTestCubes2(getRandomIntsFromInterval(5, [1, 6]));
  };

  return (
    <div className="main">
      <Cubes setRankingResult={setresult1} testCubes={testCubes1} />
      <Cubes setRankingResult={setresult2} testCubes={testCubes2} />
      {winner === USER.FIRST && (
        <span
          style={{
            color: "white",
            fontSize: 30,
            position: "absolute",
            right: 15,
            top: 15,
          }}
        >
          1
        </span>
      )}
      {winner === USER.NOBODY && (
        <span
          style={{
            color: "white",
            fontSize: 30,
            position: "absolute",
            right: 15,
            top: "50%",
          }}
        >
          DRAW
        </span>
      )}
      {winner === USER.SECOND && (
        <span
          style={{
            color: "white",
            fontSize: 30,
            position: "absolute",
            right: 15,
            bottom: 15,
          }}
        >
          2
        </span>
      )}
      <span
        style={{
          left: 15,
          bottom: 15,
          fontSize: 30,
          color: "white",
          position: "absolute",
        }}
        onClick={handleReRoll}
      >
        Re-roll
      </span>
    </div>
  );
};
