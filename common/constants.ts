import { deepClone } from "./helpers";
import { DeskType, RoundType, StageType, CurrentType } from "./types";

// DESK //

export const DEFAULT_STAGE: StageType = {
  winners: [],
  rankings: [],
  isStarted: false,
  isCompleted: false,
  isPlayerThrew: false,
};

export const DEFAULT_ROUND: RoundType = {
  winners: [],
  isCompleted: false,
  stages: [deepClone(DEFAULT_STAGE)],
};

export const DEFAULT_CURRENT: CurrentType = {
  round: 0,
  stage: 0,
  player: null,
};

export const DEFAULT_DESK: DeskType = {
  gameplay: {
    players: [],
    isLastRound: false,
    isGameEnded: false,
    isGameStarted: false,
    isShowConclusion: false,
    rounds: [deepClone(DEFAULT_ROUND)],
    max: {
      wins: 2,
      stages: 2,
      players: 2,
    },
    current: deepClone(DEFAULT_CURRENT),
  },
};

// SECKETS //

export const MESSAGES = {
  START_GAME: "startGame",
  START_THROW_DICE: "startThrowDice",
  THROW_DICE: "throwDice",
  FINISH_THROW_DICE: "finishThrowDice",
  SELECT_DICE: "selectDice",
  CLOSE_CONCLUSION: "closeConclusion",
  END_GAME: "endGame",
  CHANGE_SETTINGS: "changeSettings",
  JOIN_DESK: "joinDesk",
  LEAVE_DESK: "leaveDesk",
} as const;

export const EVENTS = {
  ON_START_GAME: "onStartGame",
  ON_START_THROW_DICE: "onStartThrowDice",
  ON_THROW_DICE: "onThrowDice",
  ON_FINISH_THROW_DICE: "onFinishThrowDice",
  ON_SELECT_DICE: "onSelectDice",
  ON_CLOSE_CONCLUSION: "onCloseConclusion",
  ON_END_GAME: "onEndGame",
  ON_CHANGE_SETTINGS: "onChangeSettings",
  ON_JOIN_DESK: "onJoinDesk",
  ON_LEAVE_DESK: "onLeaveDesk",
} as const;
