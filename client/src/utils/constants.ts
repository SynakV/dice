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
  },
  [RANKING_OF_HANDS_KEYS.PAIR]: {
    value: 1,
    name: "Pair",
    function: isPair,
  },
  [RANKING_OF_HANDS_KEYS.TWO_PAIRS]: {
    value: 2,
    name: "Two pairs",
    function: isTwoPairs,
  },
  [RANKING_OF_HANDS_KEYS.THREE_OF_A_KIND]: {
    value: 3,
    name: "Three of a kind",
    function: isThreeOfAKind,
  },
  [RANKING_OF_HANDS_KEYS.FIVE_HIGH_STRAIGHT]: {
    value: 4,
    name: "Five high straight",
    function: isFiveHighStraight,
  },
  [RANKING_OF_HANDS_KEYS.SIX_HIGH_STRAIGHT]: {
    value: 5,
    name: "Six high straight",
    function: isSixHighStraight,
  },
  [RANKING_OF_HANDS_KEYS.FULL_HOUSE]: {
    value: 6,
    name: "Full house",
    function: isFullHouse,
  },
  [RANKING_OF_HANDS_KEYS.FOUR_OF_A_KIND]: {
    value: 7,
    name: "Four of a kind",
    function: isFourOfAKind,
  },
  [RANKING_OF_HANDS_KEYS.FIVE_OF_A_KIND]: {
    value: 8,
    name: "Five of a kind",
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

export const SETTINGS = {
  NAME: "Desk",
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

export const TIMEOUT_TRANSITION = 300;

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

export const ASSETS = {
  IMAGES: [
    "amulet.png",
    "wreath.png",
    "striga.jpeg",
    "arrow-back.png",
    "grunge-line.png",
    "grunge-plus.png",
    "grunge-star.png",
    "grunge-cross.png",
    "grunge-mess.webp",
    "grunge-wifi.webp",
    "grunge-banner.png",
    "grunge-corner.png",
    "grunge-square.png",
    "grunge-cursor.png",
    "grunge-no-sign.png",
    "grunge-brush-stroke.png",
  ],
  SOUNDS: [
    "firstThrowResult",
    "gameHover",
    "gameLoose",
    "gameWin",
    "handMixDice",
    "handThrowDice",
    "hover",
    "nextRoundStart",
    "playerThinking",
    "roundLoose",
    "roundWin",
    "selectDieForReroll",
  ],
};
