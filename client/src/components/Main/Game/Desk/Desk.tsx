import {
  USER,
  DiceType,
  RoundType,
  ROUND_STAGE,
  ConclusionType,
  RankingResultWithInfoType,
} from "@src/utils/types";
import React, { FC, useEffect, useState } from "react";
import { Cubes } from "@src/components/Main/Game/Desk/Cubes/Cubes";
import { getRoundWinner } from "@src/utils/helpers/ranking/ranking.helper";

interface Props {
  isGameEnd: boolean;
  toggleHistory: () => void;
  setConclusion: (result: ConclusionType) => void;
  setHistory: (history: DiceType | null, round: RoundType | null) => void;
}

export const Desk: FC<Props> = ({
  isGameEnd,
  setHistory,
  setConclusion,
  toggleHistory,
}) => {
  const [round, setRound] = useState<RoundType | null>(null);
  const [result, setResult] = useState<DiceType | null>(null);
  const [forceRefresh, setForceRefresh] = useState<{} | null>(null);

  useEffect(() => {
    if (
      result?.[USER.FIRST]?.stage === ROUND_STAGE.END &&
      result?.[USER.SECOND]?.stage === ROUND_STAGE.END
    ) {
      const roundWinner = getRoundWinner(result);

      setRound((prev: RoundType | null) => ({
        ...prev,
        isCompleted: true,
        winner: {
          ...prev?.winner,
          ...(roundWinner
            ? {
                [roundWinner]: prev?.winner?.[roundWinner]
                  ? prev.winner[roundWinner]!++
                  : 1,
                current: roundWinner,
              }
            : {
                [USER.FIRST]: prev?.winner?.[USER.FIRST]
                  ? prev.winner[USER.FIRST]++
                  : 1,
                [USER.SECOND]: prev?.winner?.[USER.SECOND]
                  ? prev.winner[USER.SECOND]++
                  : 1,
                current: 0,
              }),
        },
      }));
      setConclusion({ result });
      setResult(null);
    }
  }, [result, round]);

  useEffect(() => {
    if (round?.stage === ROUND_STAGE.END) {
      setConclusion({ round });
    }
  }, [round]);

  useEffect(() => {
    if (!result) {
      return;
    }

    if (result?.[USER.FIRST]?.stage === result?.[USER.SECOND]?.stage) {
      setHistory(result, round);
    }
  }, [result]);

  useEffect(() => {
    if (isGameEnd) {
      setRound(null);
      setResult(null);
      setForceRefresh({});
      setHistory(null, null);
    }
  }, [isGameEnd]);

  const handleRollDice = (result: RankingResultWithInfoType | null) => {
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

      setRound((prev: RoundType | null) => ({
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
      <Cubes
        user={USER.FIRST}
        stage={round?.stage}
        forceRefresh={forceRefresh}
        setRankingResult={handleRollDice}
      />
      <Cubes
        round={round}
        user={USER.SECOND}
        stage={round?.stage}
        forceRefresh={forceRefresh}
        setRankingResult={handleRollDice}
      />
      <span className="desk__history" onClick={toggleHistory}>
        History
      </span>
      <span className="desk__round">
        Round: {(round?.value || 0) + 1}/{(round?.stage || 0) + 1}
      </span>
    </div>
  );
};
