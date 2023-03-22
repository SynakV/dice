import {
  USER,
  DiceType,
  RoundType,
  UpdateType,
  ROUND_STAGE,
  ConclusionType,
  RankingResultWithInfoType,
} from "@src/utils/types";
import React, { FC, useEffect, useState } from "react";
import { Cubes } from "@src/components/Game/Desk/Cubes/Cubes";
import { getComparisonResult } from "@src/utils/helpers/ranking/ranking.helper";

interface Props {
  isGameEnd: boolean;
  update: UpdateType | null;
  toggleHistory: () => void;
  setIsGameEnd: (isGameEnd: boolean) => void;
  setConclusion: (result: ConclusionType) => void;
  setHistory: (history: DiceType | null, round: RoundType | null) => void;
}

export const Desk: FC<Props> = ({
  update,
  isGameEnd,
  setHistory,
  setIsGameEnd,
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
      const roundWinner = getComparisonResult(result);

      setRound((prev: RoundType | null) => ({
        ...prev,
        isCompleted: true,
        winner: {
          ...prev?.winner,
          ...(roundWinner !== USER.NOBODY
            ? {
                [roundWinner]: prev?.winner?.[roundWinner]
                  ? ++prev.winner[roundWinner]!
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
                current: USER.NOBODY,
              }),
        },
        stage: {
          ...prev?.stage,
          [ROUND_STAGE.START]: true,
          [ROUND_STAGE.END]: true,
          value: 1,
          threw: {
            [USER.FIRST]: true,
            [USER.SECOND]: true,
          },
        },
        status: "Results",
      }));

      setResult(null);
      setConclusion({ result });
    }
  }, [result, round]);

  useEffect(() => {
    if (round?.isCompleted) {
      setConclusion({ round });
    }
  }, [round]);

  useEffect(() => {
    if (update) {
      setRound(update.round);
    }
  }, [update]);

  useEffect(() => {
    if (!result) {
      return;
    }

    if (result?.[USER.FIRST]?.stage === result?.[USER.SECOND]?.stage) {
      const stageWinner = getComparisonResult(result);
      setHistory(result, {
        ...round,
        stage: {
          ...round?.stage,
          winner: stageWinner,
        },
      });
    }
  }, [result]);

  useEffect(() => {
    if (isGameEnd) {
      setRound(null);
      setResult(null);
      setForceRefresh({});
      setIsGameEnd(false);
      setHistory(null, null);
    }
  }, [isGameEnd]);

  const handleResult = (result: RankingResultWithInfoType | null) => {
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
        stage: {
          ...prev?.stage,
          threw: {
            ...prev?.stage?.threw,
            [USER.FIRST]: true,
          },
        },
        isCompleted: false,
        status: "Opponent rolling...",
      }));
    } else {
      setResult((prev) => ({
        ...prev!,
        [result.user]: {
          ...result,
        },
      }));
      setRound((prev) => ({
        ...prev,
        stage: {
          ...prev?.stage,
          isCompleted: {
            ...prev?.stage?.isCompleted,
            [+(prev?.stage?.isCompleted?.[ROUND_STAGE.START] || 0)]: true,
          },
          threw: {
            ...prev?.stage?.threw,
            [USER.SECOND]: true,
          },
          isStart: false,
        },
        status: "Select dice to roll again",
      }));
    }
  };

  const handleRollDice = () => {
    setRound((prev) => {
      const isFirstStageCompleted =
        prev?.stage?.isCompleted?.[ROUND_STAGE.START];
      return {
        ...prev,
        stage: {
          ...prev?.stage,
          isStart: true,
          threw: {},
          value: isFirstStageCompleted ? ROUND_STAGE.END : ROUND_STAGE.START,
        },
        status: "Rolling...",
      };
    });
  };

  const status = round?.status;
  const isNotStart = !round?.stage?.isStart;
  const isFirstStageNotCompleted =
    !round?.stage?.isCompleted?.[ROUND_STAGE.START];

  return (
    <div className="desk">
      <div className="desk__header">
        <span
          onClick={isNotStart ? () => handleRollDice() : () => {}}
          className={`desk__roll ${isNotStart ? "" : "desk__roll--disabled"}`}
        >
          {isFirstStageNotCompleted ? "Roll" : "Re-roll"} dice
        </span>
        <span className="desk__status">
          {status ? status : 'Click "Roll dice"'}
        </span>
        <span className="desk__history" onClick={toggleHistory}>
          History
        </span>
      </div>
      <div className="desk__cubes">
        <Cubes
          round={round}
          user={USER.FIRST}
          forceRefresh={forceRefresh}
          setRankingResult={handleResult}
        />
        <Cubes
          round={round}
          user={USER.SECOND}
          forceRefresh={forceRefresh}
          setRankingResult={handleResult}
        />
      </div>
    </div>
  );
};
