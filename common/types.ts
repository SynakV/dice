// SECKETS //

export const MESSAGES = {
  MESSAGE: "message",
  GAME_START: "gameStart",
  JOIN_DESK: "joinDesk",
  LEAVE_DESK: "leaveDesk",
} as const;

export const EVENTS = {
  CONNECTION: "connection",
  ON_MESSAGE: "onMessage",
  ON_GAME_START: "onGameStart",
  ON_JOIN_DESK: "onJoinDesk",
  ON_LEAVE_DESK: "onLeaveDesk",
} as const;

// COMMON //

export enum USER {
  NOBODY,
  FIRST,
  SECOND,
}

// DESK //

export type DeskType = {
  _id?: string;
  name?: string;
  creator?: PlayerType;
  players?: PlayersType;
  gameplay: GameplayType;
};

export type PlayersType = {
  max?: number;
  players?: PlayerType[];
  sequence?: PlayerType[];
};

export type PlayerType = {
  id?: string;
  name?: string;
  cubes?: number[];
  isCreator?: boolean;
};

export type GameplayType = {
  isGameEnded?: boolean;
  round?: RoundType | null;
  result?: DiceType | null;
  history?: HistoryType | null;
};

// RANKING //

export enum RANKING_OF_HANDS_KEYS {
  NOTHING = "nothing",
  PAIR = "pair",
  TWO_PAIRS = "twoPairs",
  THREE_OF_A_KIND = "threeOfAKind",
  FIVE_HIGH_STRAIGHT = "fiveHighStraight",
  SIX_HIGH_STRAIGHT = "sixHighStraight",
  FULL_HOUSE = "fullHouse",
  FOUR_OF_A_KIND = "fourOfAKind",
  FIVE_OF_A_KIND = "fiveOfAKind",
}

export type DiceType = {
  [USER.FIRST]?: RankingResultWithInfoType;
  [USER.SECOND]?: RankingResultWithInfoType;
};

export type RankingResultType = {
  key: RANKING_OF_HANDS_KEYS;
  value: RankingOfTypeValueType;
  result: StructuredType;
};

export type RankingResultWithInfoType = RankingResultType & {
  cubes?: number[];
  stage?: ROUND_STAGE;
  user: Exclude<USER, USER.NOBODY>;
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
  [USER.FIRST]: AppearedType;
  [USER.SECOND]: AppearedType;
};

export type StructuredType = {
  appeared: AppearedType;
  rest: AppearedType;
};

// ROUND //

export enum ROUND {
  FIRST,
  SECOND,
  THIRD,
}

export enum ROUND_STAGE {
  START,
  END,
}

export type HistoryType = {
  [key in ROUND]?: {
    [key in ROUND_STAGE]?: {
      round?: RoundType;
      result?: DiceType;
    };
  };
};

export type RoundType = {
  value?: ROUND;
  stage?: {
    value?: ROUND_STAGE;
    threw?: {
      [key in USER]?: boolean;
    };
    isCompleted?: {
      [ROUND_STAGE.START]?: boolean;
      [ROUND_STAGE.END]?: boolean;
    };
    isStart?: boolean;
    winner?: USER;
  };
  status?: string;
  winner?: WinnerType;
  isCompleted?: boolean;
};

export type WinnerType = {
  [USER.FIRST]?: USER;
  [USER.SECOND]?: USER;
  current?: WinnerResultValueType;
};

export type WinnerResultValueType = USER.NOBODY | USER.FIRST | USER.SECOND;
