import {
  USER,
  RankingResultType,
  AppearesAndRestsType,
  RANKING_OF_HANDS_KEYS,
} from "@src/utils/types";
import {
  getHighestRest,
  getAppearedNumbers,
} from "@src/utils/helpers/ranking/calculations.helper";
import { RANKING_OF_HANDS } from "@utils/constants";

export const getRankingResult = (numbers: number[]): RankingResultType => {
  const appeared = getAppearedNumbers(numbers);

  let ranking: any;

  Object.entries(RANKING_OF_HANDS).find(([key, value]) => {
    const result = value.function(appeared);

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

export const getWinner = (
  cubes1: RankingResultType,
  cubes2: RankingResultType
) => {
  const value1 = cubes1.value.value;
  const value2 = cubes2.value.value;

  if (value1 === value2) {
    const appeares = {
      [USER.FIRST]: cubes1.result?.appeared,
      [USER.SECOND]: cubes2.result?.appeared,
    };

    const rests = {
      [USER.FIRST]: cubes1.result?.rest,
      [USER.SECOND]: cubes2.result?.rest,
    };

    if (
      cubes1.key === RANKING_OF_HANDS_KEYS.PAIR ||
      cubes1.key === RANKING_OF_HANDS_KEYS.THREE_OF_A_KIND ||
      cubes1.key === RANKING_OF_HANDS_KEYS.FOUR_OF_A_KIND ||
      cubes1.key === RANKING_OF_HANDS_KEYS.FIVE_OF_A_KIND
    ) {
      return getOfAKindWinner(appeares, rests);
    }

    if (cubes1.key === RANKING_OF_HANDS_KEYS.TWO_PAIRS) {
      return getTwoPairsWinner(appeares, rests);
    }

    if (cubes1.key === RANKING_OF_HANDS_KEYS.FULL_HOUSE) {
      return getFullHouseWinner(appeares);
    }

    return USER.NOBODY;
  }

  return value1 > value2 ? USER.FIRST : USER.SECOND;
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
  const hightAmongAppeared = getHighestRest(
    appeares[USER.FIRST],
    appeares[USER.SECOND]
  );

  if (hightAmongAppeared) {
    return hightAmongAppeared;
  }

  return getHighestRest(rests[USER.FIRST], rests[USER.SECOND]);
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
    return getHighestRest(rests[USER.FIRST], rests[USER.SECOND]);
  }

  return firstValues[USER.FIRST] > firstValues[USER.SECOND]
    ? USER.FIRST
    : USER.SECOND;
};
