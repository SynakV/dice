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
  players: PlayerType[];
};

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
  winners?: PlayerType[];
  isCompleted?: boolean;
};

export type StageType = {
  isStarted: boolean;
  isCompleted: boolean;
  winners?: PlayerType[];
  rankings: RankingResultWithInfoType[];
};

// SETTINGS //

export type SettingsType = {
  name: string;
  wins: number;
  stages: number;
  players: number;
};
