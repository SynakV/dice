import {
  USER,
  DiceType,
  RoundType,
  ROUND_STAGE,
  RankingResultWithStageAndUserType,
} from "@src/utils/types";
import React, { useEffect, useState } from "react";
import { Cubes } from "@src/components/Main/Desk/Cubes/Cubes";
import { getRoundWinner } from "@src/utils/helpers/ranking/ranking.helper";

export const Desk = () => {
  const [round, setRound] = useState<RoundType | null>(null);
  const [result, setResult] = useState<DiceType | null>(null);

  useEffect(() => {
    if (
      result?.[USER.FIRST]?.stage === ROUND_STAGE.END &&
      result?.[USER.SECOND]?.stage === ROUND_STAGE.END
    ) {
      const newWinner = getRoundWinner(result);
      setRound((prev) => ({
        ...prev,
        isCompleted: true,
        winner: {
          ...prev?.winner,
          ...(newWinner
            ? {
                [newWinner]: prev?.winner?.[newWinner]
                  ? prev.winner[newWinner]!++
                  : 1,
              }
            : {
                [USER.FIRST]: prev?.winner?.[USER.FIRST]
                  ? prev.winner[USER.FIRST]++
                  : 1,
                [USER.SECOND]: prev?.winner?.[USER.SECOND]
                  ? prev.winner[USER.SECOND]++
                  : 1,
              }),
        },
      }));
      setResult(null);
    }
  }, [result, round]);

  const handleRollDice = (result: RankingResultWithStageAndUserType | null) => {
    if (!result) {
      return;
    }

    if (result?.user === USER.FIRST) {
      setResult((prev) => ({
        ...prev!,
        [result.user]: {
          ...result,
          stage:
            prev?.[result?.user]?.stage === ROUND_STAGE.START
              ? ROUND_STAGE.END
              : ROUND_STAGE.START,
        },
      }));

      setRound((prev) => ({
        ...prev,
        value:
          prev?.stage === ROUND_STAGE.END
            ? (prev?.value || 0) + 1
            : prev?.value || 0,
        stage:
          prev?.stage === ROUND_STAGE.START
            ? ROUND_STAGE.END
            : ROUND_STAGE.START,
        isCompleted: false,
      }));
    } else {
      setResult((prev) => ({
        ...prev!,
        [result.user]: {
          ...result,
        },
      }));
    }
  };

  return (
    <div className="desk">
      <Cubes user={USER.FIRST} setRankingResult={handleRollDice} />
      <Cubes
        round={round}
        user={USER.SECOND}
        setRankingResult={handleRollDice}
      />
      {renderWinner(round)}
    </div>
  );
};

const renderWinner = (round?: RoundType | null) => (
  <>
    <span
      style={{
        top: 15,
        right: 15,
        fontSize: 30,
        color: "white",
        position: "absolute",
      }}
    >
      {round?.winner?.[USER.FIRST] || 0}
    </span>
    <span
      style={{
        right: 15,
        top: "50%",
        fontSize: 30,
        color: "white",
        position: "absolute",
      }}
    >
      {round?.winner?.value === 0 && "DRAW"}
    </span>
    <span
      style={{
        right: 15,
        bottom: 15,
        fontSize: 30,
        color: "white",
        position: "absolute",
      }}
    >
      {round?.winner?.[USER.SECOND] || 0}
    </span>
    <span
      style={{
        left: 15,
        top: 15,
        fontSize: 30,
        cursor: "pointer",
        position: "absolute",
        color: "rgba(255, 255, 255, 0.5)",
      }}
    >
      Round: {(round?.value || 0) + 1}
    </span>
    <span
      style={{
        top: 50,
        left: 15,
        fontSize: 30,
        cursor: "pointer",
        position: "absolute",
        color: "rgba(255, 255, 255, 0.5)",
      }}
    >
      Stage: {(round?.stage || 0) + 1}
    </span>
    {/* <span
        style={{
          left: 15,
          bottom: 15,
          fontSize: 30,
          cursor: "pointer",
          position: "absolute",
          color: "rgba(255, 255, 255, 0.5)",
        }}
        onClick={handleReRoll}
      >
        Re-roll
      </span> */}
  </>
);
