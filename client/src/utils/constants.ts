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
} from "@utils/helpers/ranking/calculations.helper";
import { RankingOfHandsType, RANKING_OF_HANDS_KEYS } from "@utils/common/types";

export const RANKING_OF_HANDS: RankingOfHandsType = {
  [RANKING_OF_HANDS_KEYS.NOTHING]: {
    value: 0,
    name: "Nothing",
    function: isNothing,
    description: "five mismatched dice forming no sequence longer than four.",
  },
  [RANKING_OF_HANDS_KEYS.PAIR]: {
    value: 1,
    name: "Pair",
    function: isPair,
    description: "two dice showing the same value.",
  },
  [RANKING_OF_HANDS_KEYS.TWO_PAIRS]: {
    value: 2,
    name: "Two pairs",
    function: isTwoPairs,
    description: "two pairs of dice, each showing the same value.",
  },
  [RANKING_OF_HANDS_KEYS.THREE_OF_A_KIND]: {
    value: 3,
    name: "Three of a kind",
    function: isThreeOfAKind,
    description: "three dice showing the same value.",
  },
  [RANKING_OF_HANDS_KEYS.FIVE_HIGH_STRAIGHT]: {
    value: 4,
    name: "Five high straight",
    function: isFiveHighStraight,
    description: "dice showing values from 1 through 5, inclusive.",
  },
  [RANKING_OF_HANDS_KEYS.SIX_HIGH_STRAIGHT]: {
    value: 5,
    name: "Six high straight",
    function: isSixHighStraight,
    description: "dice showing values from 2 through 6, inclusive.",
  },
  [RANKING_OF_HANDS_KEYS.FULL_HOUSE]: {
    value: 6,
    name: "Full house",
    function: isFullHouse,
    description: "Pair of one value and Three-of-a-Kind of another.",
  },
  [RANKING_OF_HANDS_KEYS.FOUR_OF_A_KIND]: {
    value: 7,
    name: "Four of a kind",
    function: isFourOfAKind,
    description: "four dice showing the same value.",
  },
  [RANKING_OF_HANDS_KEYS.FIVE_OF_A_KIND]: {
    value: 8,
    name: "Five of a kind",
    function: isFiveOfAKind,
    description: "all five dice showing the same value.",
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

export const SETTINGS = {
  MIN: {
    WINS: 2,
    STAGES: 2,
    PLAYERS: 2,
  },
  MAX: {
    WINS: 5,
    STAGES: 5,
    PLAYERS: 5,
  },
};

export const MODE = {
  online: {
    url: "online",
    title: "Online",
  },
  offline: {
    url: "offline",
    title: "Offline",
  },
};

export const NAMES = [
  "Martin Andrews",
  "Destiny Perez",
  "Adrienne Lee",
  "Jamie Solis",
  "Toni Evans",
  "Teresa Williams",
  "Colin Harris",
  "Terry Edwards",
  "Mr. Michael Perez",
  "James Lewis",
];
