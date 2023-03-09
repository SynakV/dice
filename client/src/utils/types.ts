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

export type RankingOfHandsType = {
  [key in RANKING_OF_HANDS_KEYS]: {
    value: number;
    text: string;
    function: (numbers: AppearedType) => AppearedType | false | any;
  };
};

export type AppearedType = ReturnType<typeof Object.entries>;
