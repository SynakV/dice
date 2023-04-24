// DESK //

export type DeskType = {
  _id?: string;
  name?: string;
  gameplay: GameplayType;
};

export type PlayerType = {
  id: string;
  name: string;
};

export type CredentialsType = Partial<PlayerType>;

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
  rankings: RankingWithInfoType[];
};

export type CurrentType = {
  round: number;
  stage: number;
  player: PlayerType | null;
};

export type MaxType = {
  wins: number;
  stages: number;
  players: number;
};

// TIMERS //

export type Timers = {
  [key in TIMERS]: number;
};

export enum TIMERS {
  STAGE_THINKING_TIME = 30,
}

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

export type RankingType = {
  key: RANKING_OF_HANDS_KEYS;
  value: RankingOfTypeValueType;
  result: StructuredType;
};

export type RankingWithInfoType = RankingType & {
  stage: number;
  cubes: CubesType;
  player: PlayerType;
};

export type CubesType = {
  roll?: number[];
  reroll?: RerollType;
};

export type RerollType = (number | null)[];

export type RankingOfHandsType = {
  [key in RANKING_OF_HANDS_KEYS]: RankingOfTypeValueType;
};

export type RankingOfTypeValueType = {
  name: string;
  value: number;
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

// SETTINGS //

export type SettingsType = {
  wins: number;
  stages: number;
  players: number;
  name: string | null;
};
