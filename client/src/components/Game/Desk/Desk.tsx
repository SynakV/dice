import {
  USER,
  ROUND_STAGE,
  RankingResultWithInfoType,
} from "@utils/common/types";
import React, { useEffect, useState } from "react";
import { useDesk } from "@src/utils/contexts/DeskContext";
import { Cubes } from "@src/components/Game/Desk/Cubes/Cubes";
import { getComparisonResult } from "@src/utils/helpers/ranking/ranking.helper";

export const Desk = () => {
  const { desk, setDesk } = useDesk();
  const [forceRefresh, setForceRefresh] = useState<{} | null>(null);

  useEffect(() => {
    if (
      desk?.gameplay?.result?.[USER.FIRST]?.stage === ROUND_STAGE.END &&
      desk?.gameplay?.result?.[USER.SECOND]?.stage === ROUND_STAGE.END
    ) {
      const roundWinner = getComparisonResult(desk?.gameplay?.result);
      console.log(desk.gameplay.history);
      setDesk((prev) => ({
        ...prev,
        gameplay: {
          ...prev?.gameplay,
          result: null,
          round: {
            ...prev?.gameplay?.round,
            isCompleted: true,
            winner: {
              ...prev?.gameplay?.round?.winner,
              ...(roundWinner !== USER.NOBODY
                ? {
                    [roundWinner]: prev?.gameplay?.round?.winner?.[roundWinner]
                      ? ++prev.gameplay.round.winner[roundWinner]!
                      : 1,
                    current: roundWinner,
                  }
                : {
                    [USER.FIRST]: prev?.gameplay?.round?.winner?.[USER.FIRST]
                      ? prev.gameplay.round.winner[USER.FIRST]++
                      : 1,
                    [USER.SECOND]: prev?.gameplay?.round?.winner?.[USER.SECOND]
                      ? prev.gameplay.round.winner[USER.SECOND]++
                      : 1,
                    current: USER.NOBODY,
                  }),
            },
            stage: {
              ...prev?.gameplay?.round?.stage,
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
        },
      }));
    }
  }, [desk?.gameplay?.result, desk?.gameplay?.round]);

  useEffect(() => {
    if (!desk?.gameplay?.result) {
      return;
    }

    if (
      desk?.gameplay?.result?.[USER.FIRST]?.stage ===
      desk?.gameplay?.result?.[USER.SECOND]?.stage
    ) {
      const stageWinner = getComparisonResult(desk?.gameplay?.result!);
      console.log(desk.gameplay.history);
      setDesk((prev) => ({
        ...prev,
        gameplay: {
          ...prev?.gameplay,
          history: {
            ...prev?.gameplay?.history,
            [prev?.gameplay?.round?.value || 0]: {
              ...prev?.gameplay?.history?.[prev?.gameplay?.round?.value || 0],
              [prev?.gameplay?.round?.stage?.value || 0]: {
                result: desk?.gameplay?.result,
                round: {
                  ...desk?.gameplay?.round,
                  stage: {
                    ...desk?.gameplay?.round?.stage,
                    winner: stageWinner,
                  },
                },
              },
            },
          },
        },
      }));
    }
  }, [desk?.gameplay?.result]);

  useEffect(() => {
    if (desk?.gameplay?.isGameEnded) {
      setForceRefresh({});
      setDesk((prev) => ({
        ...prev,
        gameplay: {
          isGameEnded: false,
        },
      }));
    }
  }, [desk?.gameplay?.isGameEnded]);

  const handleResult = (result: RankingResultWithInfoType | null) => {
    if (!result) {
      return;
    }

    if (result?.user === USER.FIRST) {
      setDesk((prev) => ({
        ...prev,
        gameplay: {
          ...prev?.gameplay,
          result: {
            ...prev?.gameplay?.result!,
            [result.user]: {
              ...result,
              stage:
                prev?.gameplay?.result?.[result?.user]?.stage ===
                ROUND_STAGE.START
                  ? ROUND_STAGE.END
                  : ROUND_STAGE.START,
            },
          },
          round: {
            ...prev?.gameplay?.round,
            stage: {
              ...prev?.gameplay?.round?.stage,
              threw: {
                ...prev?.gameplay?.round?.stage?.threw,
                [USER.FIRST]: true,
              },
            },
            isCompleted: false,
            status: "Opponent rolling...",
          },
        },
      }));
    } else {
      setDesk((prev) => ({
        ...prev,
        gameplay: {
          ...prev?.gameplay,
          result: {
            ...prev?.gameplay?.result!,
            [result.user]: {
              ...result,
            },
          },
          round: {
            ...prev?.gameplay?.round,
            stage: {
              ...prev?.gameplay?.round?.stage,
              isCompleted: {
                ...prev?.gameplay?.round?.stage?.isCompleted,
                [+(
                  prev?.gameplay?.round?.stage?.isCompleted?.[
                    ROUND_STAGE.START
                  ] || 0
                )]: true,
              },
              threw: {
                ...prev?.gameplay?.round?.stage?.threw,
                [USER.SECOND]: true,
              },
              isStart: false,
            },
            status: "Select dice to roll again",
          },
        },
      }));
    }
  };

  return (
    <div className="desk">
      <div className="desk__cubes">
        <Cubes
          user={USER.FIRST}
          forceRefresh={forceRefresh}
          setRankingResult={handleResult}
          round={desk?.gameplay?.round || null}
        />
        <Cubes
          user={USER.SECOND}
          forceRefresh={forceRefresh}
          setRankingResult={handleResult}
          round={desk?.gameplay?.round || null}
        />
      </div>
    </div>
  );
};
