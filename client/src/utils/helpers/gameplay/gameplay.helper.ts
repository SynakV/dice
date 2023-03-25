import {
  USER,
  DeskType,
  ROUND_STAGE,
  WinnerResultValueType,
  RankingResultWithInfoType,
} from "@src/utils/common/types";

export const afterTriggerStageStart = (prev: DeskType | null) => {
  const isFirstStageCompleted =
    prev?.gameplay?.round?.stage?.isCompleted?.[ROUND_STAGE.START];
  return {
    ...prev,
    gameplay: {
      ...prev?.gameplay,
      round: {
        ...prev?.gameplay?.round,
        stage: {
          ...prev?.gameplay?.round?.stage,
          isStart: true,
          threw: {},
          value: isFirstStageCompleted ? ROUND_STAGE.END : ROUND_STAGE.START,
        },
        status: "Rolling...",
      },
    },
  };
};

export const afterSaveHistory = (
  prev: DeskType | null,
  desk: DeskType,
  stageWinner: WinnerResultValueType
) => {
  return {
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
  };
};

export const afterEndRound = (
  prev: DeskType | null,
  roundWinner: WinnerResultValueType
) => {
  return {
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
  };
};

export const afterEndGame = (prev: DeskType | null) => ({
  ...prev,
  gameplay: {
    isGameEnded: false,
  },
});

export const afterFirstThrew = (
  prev: DeskType | null,
  result: RankingResultWithInfoType
) => ({
  ...prev,
  gameplay: {
    ...prev?.gameplay,
    result: {
      ...prev?.gameplay?.result!,
      [result.user]: {
        ...result,
        stage:
          prev?.gameplay?.result?.[result?.user]?.stage === ROUND_STAGE.START
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
});

export const afterSecondThrew = (
  prev: DeskType | null,
  result: RankingResultWithInfoType
) => ({
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
            prev?.gameplay?.round?.stage?.isCompleted?.[ROUND_STAGE.START] || 0
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
});

export const afterConclusionClose = (
  prev: DeskType | null,
  isLastRound: boolean
) => ({
  ...prev,
  gameplay: {
    ...prev?.gameplay,
    isGameEnded: isLastRound,
    round: {
      ...prev?.gameplay?.round,
      value: (prev?.gameplay?.round?.value || 0) + 1,
      isCompleted: false,
      stage: {},
      status: "",
    },
  },
});
