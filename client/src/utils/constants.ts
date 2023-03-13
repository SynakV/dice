import { RankingOfHandsType, RANKING_OF_HANDS_KEYS } from "./types";
import {
  isNothing,
  isPair,
  isTwoPairs,
  isThreeOfAKind,
  isFiveHighStraight,
  isSixHighStraight,
  isFullHouse,
  isFourOfAKind,
  isFiveOfAKind,
} from "@src/utils/helpers/ranking/calculations.helper";

export const RANKING_OF_HANDS: RankingOfHandsType = {
  [RANKING_OF_HANDS_KEYS.NOTHING]: {
    value: 0,
    text: "Nothing",
    function: isNothing,
  },
  [RANKING_OF_HANDS_KEYS.PAIR]: {
    value: 1,
    text: "Pair",
    function: isPair,
  },
  [RANKING_OF_HANDS_KEYS.TWO_PAIRS]: {
    value: 2,
    text: "Two pairs",
    function: isTwoPairs,
  },
  [RANKING_OF_HANDS_KEYS.THREE_OF_A_KIND]: {
    value: 3,
    text: "Three of a kind",
    function: isThreeOfAKind,
  },
  [RANKING_OF_HANDS_KEYS.FIVE_HIGH_STRAIGHT]: {
    value: 4,
    text: "Five high straight",
    function: isFiveHighStraight,
  },
  [RANKING_OF_HANDS_KEYS.SIX_HIGH_STRAIGHT]: {
    value: 5,
    text: "Six high straight",
    function: isSixHighStraight,
  },
  [RANKING_OF_HANDS_KEYS.FULL_HOUSE]: {
    value: 6,
    text: "Full house",
    function: isFullHouse,
  },
  [RANKING_OF_HANDS_KEYS.FOUR_OF_A_KIND]: {
    value: 7,
    text: "Four of a kind",
    function: isFourOfAKind,
  },
  [RANKING_OF_HANDS_KEYS.FIVE_OF_A_KIND]: {
    value: 8,
    text: "Five of a kind",
    function: isFiveOfAKind,
  },
};

export const DICE = {
  COUNT: 5,
  MAX_WINS: 2,
  RANGE: {
    MIN: 1,
    MAX: 6,
  },
};
