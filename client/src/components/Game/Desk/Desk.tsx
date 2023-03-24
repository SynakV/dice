import {
  USER,
  ROUND_STAGE,
  GameplayType,
  RankingResultWithInfoType,
} from "@utils/common/types";
import React, { FC, useEffect, useState } from "react";
import { Cubes } from "@src/components/Game/Desk/Cubes/Cubes";
import { getComparisonResult } from "@src/utils/helpers/ranking/ranking.helper";

interface Props {
  gameplay: GameplayType;
  toggleHistory: () => void;
  setGameplay: (gameplay: React.SetStateAction<GameplayType>) => void;
}

export const Desk: FC<Props> = ({ gameplay, setGameplay, toggleHistory }) => {
  const [forceRefresh, setForceRefresh] = useState<{} | null>(null);

  useEffect(() => {
    if (
      gameplay?.result?.[USER.FIRST]?.stage === ROUND_STAGE.END &&
      gameplay?.result?.[USER.SECOND]?.stage === ROUND_STAGE.END
    ) {
      const roundWinner = getComparisonResult(gameplay?.result);

      setGameplay((prev) => ({
        ...prev,
        result: null,
        round: {
          ...prev?.round,
          isCompleted: true,
          winner: {
            ...prev?.round?.winner,
            ...(roundWinner !== USER.NOBODY
              ? {
                  [roundWinner]: prev?.round?.winner?.[roundWinner]
                    ? ++prev.round.winner[roundWinner]!
                    : 1,
                  current: roundWinner,
                }
              : {
                  [USER.FIRST]: prev?.round?.winner?.[USER.FIRST]
                    ? prev.round.winner[USER.FIRST]++
                    : 1,
                  [USER.SECOND]: prev?.round?.winner?.[USER.SECOND]
                    ? prev.round.winner[USER.SECOND]++
                    : 1,
                  current: USER.NOBODY,
                }),
          },
          stage: {
            ...prev?.round?.stage,
            [ROUND_STAGE.START]: true,
            [ROUND_STAGE.END]: true,
            value: 1,
            threw: {
              [USER.FIRST]: true,
              [USER.SECOND]: true,
            },
            isStart: false,
          },
          status: "Results",
        },
      }));
    }
  }, [gameplay?.result, gameplay?.round]);

  useEffect(() => {
    if (!gameplay?.result) {
      return;
    }

    if (
      gameplay?.result?.[USER.FIRST]?.stage ===
      gameplay?.result?.[USER.SECOND]?.stage
    ) {
      const stageWinner = getComparisonResult(gameplay?.result);
      setGameplay((prev) => ({
        ...prev,
        history: {
          ...prev.history,
          [prev?.round?.value || 0]: {
            ...prev?.history?.[prev?.round?.value || 0],
            [prev?.round?.stage?.value || 0]: {
              result: gameplay.result,
              round: {
                ...gameplay.round,
                stage: {
                  ...gameplay.round?.stage,
                  winner: stageWinner,
                },
              },
            },
          },
        },
      }));
    }
  }, [gameplay?.result]);

  useEffect(() => {
    if (gameplay.isGameEnded) {
      setForceRefresh({});
      setGameplay({ isGameEnded: false });
    }
  }, [gameplay.isGameEnded]);

  const handleResult = (result: RankingResultWithInfoType | null) => {
    if (!result) {
      return;
    }

    if (result?.user === USER.FIRST) {
      setGameplay((prev) => ({
        ...prev,
        result: {
          ...prev?.result!,
          [result.user]: {
            ...result,
            stage:
              prev?.result?.[result?.user]?.stage === ROUND_STAGE.START
                ? ROUND_STAGE.END
                : ROUND_STAGE.START,
          },
        },
        round: {
          ...prev?.round,
          stage: {
            ...prev?.round?.stage,
            threw: {
              ...prev?.round?.stage?.threw,
              [USER.FIRST]: true,
            },
          },
          isCompleted: false,
          status: "Opponent rolling...",
        },
      }));
    } else {
      setGameplay((prev) => ({
        ...prev,
        result: {
          ...prev?.result!,
          [result.user]: {
            ...result,
          },
        },
        round: {
          ...prev?.round,
          stage: {
            ...prev?.round?.stage,
            isCompleted: {
              ...prev?.round?.stage?.isCompleted,
              [+(prev?.round?.stage?.isCompleted?.[ROUND_STAGE.START] || 0)]:
                true,
            },
            threw: {
              ...prev?.round?.stage?.threw,
              [USER.SECOND]: true,
            },
            isStart: false,
          },
          status: "Select dice to roll again",
        },
      }));
    }
  };

  const handleRollDice = () => {
    setGameplay((prev) => {
      const isFirstStageCompleted =
        prev?.round?.stage?.isCompleted?.[ROUND_STAGE.START];
      return {
        ...prev,
        round: {
          ...prev?.round,
          stage: {
            ...prev?.round?.stage,
            isStart: true,
            threw: {},
            value: isFirstStageCompleted ? ROUND_STAGE.END : ROUND_STAGE.START,
          },
          status: "Rolling...",
        },
      };
    });
  };

  const status = gameplay?.round?.status;
  const isNotStart = !gameplay?.round?.stage?.isStart;
  const isFirstStageNotCompleted =
    !gameplay?.round?.stage?.isCompleted?.[ROUND_STAGE.START];

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
          user={USER.FIRST}
          forceRefresh={forceRefresh}
          setRankingResult={handleResult}
          round={gameplay?.round || null}
        />
        <Cubes
          user={USER.SECOND}
          forceRefresh={forceRefresh}
          setRankingResult={handleResult}
          round={gameplay?.round || null}
        />
      </div>
    </div>
  );
};
