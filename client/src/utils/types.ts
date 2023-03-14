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

export enum USER {
  NOBODY,
  FIRST,
  SECOND,
}

export enum OPPONENT {
  COMPUTER = "Computer",
  ANOTHER_USER = "Another user",
}

export enum ROUND_STAGE {
  START,
  END,
}

export enum ROUND {
  FIRST,
  SECOND,
  THIRD,
}

export type RoundType = {
  value?: ROUND;
  stage?: ROUND_STAGE;
  winner?: WinnerType;
  isCompleted?: boolean;
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

export type RankingResultType = {
  key: string;
  value: RankingOfTypeValueType;
  result: StructuredType;
};

export type RankingResultWithInfoType = RankingResultType & {
  cubes?: number[];
  stage?: ROUND_STAGE;
  user: Exclude<USER, USER.NOBODY>;
};

export type StructuredType = {
  appeared: AppearedType;
  rest: AppearedType;
};

export type WinnerType = {
  [USER.FIRST]?: USER;
  [USER.SECOND]?: USER;
  current?: WinnerResultValueType;
};

export type DiceType = {
  [USER.FIRST]: RankingResultWithInfoType;
  [USER.SECOND]: RankingResultWithInfoType;
};

export type WinnerResultValueType = USER.NOBODY | USER.FIRST | USER.SECOND;

export type ConclusionType = {
  round?: RoundType | null;
  result?: DiceType | null;
  history?: HistoryType | null;
};

export type HistoryType = {
  [key in ROUND]?: {
    [key in ROUND_STAGE]?: {
      [key in USER]: RankingResultWithInfoType;
    };
  };
};
