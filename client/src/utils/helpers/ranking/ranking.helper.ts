import {
  USER,
  DiceType,
  RoundType,
  StructuredType,
  RankingResultType,
  AppearesAndRestsType,
  RANKING_OF_HANDS_KEYS,
} from "@src/utils/types";
import {
  getHighestRest,
  getAppearedNumbers,
} from "@src/utils/helpers/ranking/calculations.helper";
import { DICE, RANKING_OF_HANDS } from "@utils/constants";

export const getRankingResult = (numbers: number[]): RankingResultType => {
  const appeared = getAppearedNumbers(numbers);

  let ranking: any;

  Object.entries(RANKING_OF_HANDS).find(([key, value]) => {
    const result: StructuredType | false = value.function(appeared);

    if (result) {
      return (ranking = {
        key,
        value,
        result,
      });
    }
  });

  return (
    ranking || {
      key: RANKING_OF_HANDS_KEYS.NOTHING,
      value: RANKING_OF_HANDS.nothing,
      result: { appeared },
    }
  );
};

export const getComparisonResult = (dice: DiceType) => {
  const value = {
    [USER.FIRST]: dice[USER.FIRST].value.value,
    [USER.SECOND]: dice[USER.SECOND].value.value,
  };

  if (value[USER.FIRST] === value[USER.SECOND]) {
    const appeares = {
      [USER.FIRST]: dice[USER.FIRST].result?.appeared,
      [USER.SECOND]: dice[USER.SECOND].result?.appeared,
    };

    const rests = {
      [USER.FIRST]: dice[USER.FIRST].result?.rest,
      [USER.SECOND]: dice[USER.SECOND].result?.rest,
    };

    if (
      dice[USER.FIRST].key === RANKING_OF_HANDS_KEYS.PAIR ||
      dice[USER.FIRST].key === RANKING_OF_HANDS_KEYS.THREE_OF_A_KIND ||
      dice[USER.FIRST].key === RANKING_OF_HANDS_KEYS.FOUR_OF_A_KIND ||
      dice[USER.FIRST].key === RANKING_OF_HANDS_KEYS.FIVE_OF_A_KIND
    ) {
      return getOfAKindWinner(appeares, rests);
    }

    if (dice[USER.FIRST].key === RANKING_OF_HANDS_KEYS.TWO_PAIRS) {
      return getTwoPairsWinner(appeares, rests);
    }

    if (dice[USER.FIRST].key === RANKING_OF_HANDS_KEYS.FULL_HOUSE) {
      return getFullHouseWinner(appeares);
    }

    return USER.NOBODY;
  }

  return value[USER.FIRST] > value[USER.SECOND] ? USER.FIRST : USER.SECOND;
};

export const getGameWinner = (round: RoundType) => {
  if (
    round.winner?.[USER.FIRST] === DICE.MAX_WINS ||
    round.winner?.[USER.SECOND] === DICE.MAX_WINS
  ) {
    if (round.winner?.[USER.FIRST] === round.winner?.[USER.SECOND]) {
      return USER.NOBODY;
    }

    return (round.winner[USER.FIRST] || 0) > (round.winner[USER.SECOND] || 0)
      ? USER.FIRST
      : USER.SECOND;
  }

  return false;
};

const getFullHouseWinner = (appeares: AppearesAndRestsType) => {
  const triples = {
    [USER.FIRST]: +(appeares[USER.FIRST] as any).triple.appeared[0][0],
    [USER.SECOND]: +(appeares[USER.SECOND] as any).triple.appeared[0][0],
  };

  const pairs = {
    [USER.FIRST]: +(appeares[USER.FIRST] as any).pair.appeared[0][0],
    [USER.SECOND]: +(appeares[USER.SECOND] as any).pair.appeared[0][0],
  };

  if (triples[USER.FIRST] === triples[USER.SECOND]) {
    if (pairs[USER.FIRST] === pairs[USER.SECOND]) {
      return USER.NOBODY;
    }

    return pairs[USER.FIRST] > pairs[USER.SECOND] ? USER.FIRST : USER.SECOND;
  }

  return triples[USER.FIRST] > triples[USER.SECOND] ? USER.FIRST : USER.SECOND;
};

const getTwoPairsWinner = <T extends AppearesAndRestsType>(
  appeares: T,
  rests: T
) => {
  const hightAmongAppeared = getHighestRest(appeares);

  if (hightAmongAppeared) {
    return hightAmongAppeared;
  }

  return getHighestRest(rests);
};

const getOfAKindWinner = <T extends AppearesAndRestsType>(
  appeares: T,
  rests: T
) => {
  const firstValues = {
    [USER.FIRST]: appeares[USER.FIRST][0][0],
    [USER.SECOND]: appeares[USER.SECOND][0][0],
  };

  if (firstValues[USER.FIRST] === firstValues[USER.SECOND]) {
    return getHighestRest(rests);
  }

  return firstValues[USER.FIRST] > firstValues[USER.SECOND]
    ? USER.FIRST
    : USER.SECOND;
};
