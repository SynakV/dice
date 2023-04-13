// SECKETS //

export const MESSAGES = {
  START_GAME: 'startGame',
  START_THROW_DICE: 'startThrowDice',
  THROW_DICE: 'throwDice',
  FINISH_THROW_DICE: 'finishThrowDice',
  CLOSE_CONCLUSION: 'closeConclusion',
  END_GAME: 'endGame',
  CHANGE_SETTINGS: 'changeSettings',
  JOIN_DESK: 'joinDesk',
  LEAVE_DESK: 'leaveDesk',
} as const;

export const EVENTS = {
  ON_START_GAME: 'onStartGame',
  ON_START_THROW_DICE: 'onStartThrowDice',
  ON_THROW_DICE: 'onThrowDice',
  ON_FINISH_THROW_DICE: 'onFinishThrowDice',
  ON_CLOSE_CONCLUSION: 'onCloseConclusion',
  ON_END_GAME: 'onEndGame',
  ON_CHANGE_SETTINGS: 'onChangeSettings',
  ON_JOIN_DESK: 'onJoinDesk',
  ON_LEAVE_DESK: 'onLeaveDesk',
} as const;

// DESK //

export type DeskType = {
  _id?: string;
  name?: string;
  creator?: PlayerType;
  gameplay: GameplayType;
};

export type PlayerType = {
  id?: string;
  name: string;
  isCreator?: boolean;
};

export type GameplayType = {
  max: MaxType;
  rounds: RoundType[];
  current: CurrentType;
  isGameEnded: boolean;
  isGameStarted: boolean;
  isLastRound: boolean;
  isShowConclusion: boolean;
  players: PlayerType[];
  timers?: Timers;
};

export type Timers = {
  [key in TIMERS]: number;
};

export enum TIMERS {
  STAGE_THINKING_TIME = 30,
}

export type CurrentType = {
  round: number;
  stage: number;
  status?: string;
  player: PlayerType | null;
};

export type MaxType = {
  wins: number;
  stages: number;
  players: number;
};

// RANKING //

export enum RANKING_OF_HANDS_KEYS {
  NOTHING = 'nothing',
  PAIR = 'pair',
  TWO_PAIRS = 'twoPairs',
  THREE_OF_A_KIND = 'threeOfAKind',
  FIVE_HIGH_STRAIGHT = 'fiveHighStraight',
  SIX_HIGH_STRAIGHT = 'sixHighStraight',
  FULL_HOUSE = 'fullHouse',
  FOUR_OF_A_KIND = 'fourOfAKind',
  FIVE_OF_A_KIND = 'fiveOfAKind',
}

export type RankingResultType = {
  key: RANKING_OF_HANDS_KEYS;
  value: RankingOfTypeValueType;
  result: StructuredType;
};

export type RankingResultWithInfoType = RankingResultType & {
  stage?: number;
  cubes?: number[];
  player: PlayerType;
};

export type RankingOfHandsType = {
  [key in RANKING_OF_HANDS_KEYS]: RankingOfTypeValueType;
};

export type RankingOfTypeValueType = {
  name: string;
  value: number;
  description: string;
  function: (numbers: AppearedType) => AppearedType | false | any;
};

export type AppearedType = ReturnType<typeof Object.entries>;

export type AppearesAndRestsType = {
  [key: number]: AppearedType;
};

export type StructuredType = {
  appeared: AppearedType;
  rest: AppearedType;
};

// ROUND //

export type RoundType = {
  stages: StageType[];
  winners: PlayerType[];
  isCompleted: boolean;
};

export type StageType = {
  isStarted: boolean;
  isCompleted: boolean;
  isPlayerThrew: boolean;
  winners: PlayerType[];
  rankings: RankingResultWithInfoType[];
};

// SETTINGS //

export type SettingsType = {
  name: string;
  wins: number;
  stages: number;
  players: number;
};
