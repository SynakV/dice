import {
  USER,
  AppearedType,
  StructuredType,
  WinnerResultValueType,
} from "@src/utils/types";

export const getAppearedNumbers = (numbers: number[]) => {
  const appeared: { [key: number]: number } = {};

  for (let i = 0; i < numbers.length; i++) {
    if (!(numbers[i] in appeared)) {
      appeared[numbers[i]] = 0;
    }
    appeared[numbers[i]]++;
  }

  return Object.entries(appeared);
};

const getHighStraight = (appeared: [string, number][], min: number) => {
  for (let i = 0; i < 5; i++) {
    if (appeared[i][1] !== 1 || +appeared[i][0] !== min + i) {
      return false;
    }
  }

  return min === +appeared[0][0] && appeared;
};

const getFilteredOccurrences = (
  appeared: AppearedType,
  occurrences: number
) => {
  const structured: StructuredType = {
    appeared: [],
    rest: [],
  };

  appeared.forEach(([key, value]) => {
    if (value === occurrences) {
      structured.appeared.push([key, value]);
    } else {
      structured.rest.push([key, value]);
    }
  });

  return structured;
};

export const isNothing = (_: AppearedType) => false;

export const isPair = (appeared: AppearedType) => {
  const pairOccurrences = getFilteredOccurrences(appeared, 2);
  const tripleOccurrences = getFilteredOccurrences(appeared, 3);
  const isFound =
    pairOccurrences.appeared.length === 1 &&
    tripleOccurrences.appeared.length !== 1;

  return isFound ? pairOccurrences : false;
};

export const isTwoPairs = (appeared: AppearedType) => {
  const pairOccurrences = getFilteredOccurrences(appeared, 2);
  const isFound = pairOccurrences.appeared.length === 2;
  return isFound ? pairOccurrences : false;
};

export const isThreeOfAKind = (appeared: AppearedType) => {
  const tripleOccurrences = getFilteredOccurrences(appeared, 3);
  const pairOccurrences = getFilteredOccurrences(appeared, 2);
  const isFound =
    tripleOccurrences.appeared.length === 1 &&
    pairOccurrences.appeared.length !== 1;

  return isFound ? tripleOccurrences : false;
};

export const isFiveHighStraight = (appeared: AppearedType) => {
  return getHighStraight(appeared, 1);
};

export const isSixHighStraight = (appeared: AppearedType) => {
  return getHighStraight(appeared, 2);
};

export const isFullHouse = (appeared: AppearedType) => {
  const tripleOccurrences = getFilteredOccurrences(appeared, 3);
  const pairOccurrences = getFilteredOccurrences(appeared, 2);
  const isFound =
    tripleOccurrences.appeared.length === 1 &&
    pairOccurrences.appeared.length === 1;

  return isFound
    ? { appeared: { triple: tripleOccurrences, pair: pairOccurrences } }
    : false;
};

export const isFourOfAKind = (appeared: AppearedType) => {
  const quartetOccurrences = getFilteredOccurrences(appeared, 4);
  const isFound = quartetOccurrences.appeared.length === 1;
  return isFound ? quartetOccurrences : false;
};

export const isFiveOfAKind = (appeared: AppearedType) => {
  const quintetOccurrences = getFilteredOccurrences(appeared, 5);
  const isFound = quintetOccurrences.appeared.length === 1;
  return isFound ? quintetOccurrences : false;
};

export const getHighestRest = <T extends [key: string, value: number][]>(
  rest1: T,
  rest2: T
): WinnerResultValueType => {
  const length = rest1.length;

  let maxes = {
    [USER.FIRST]: {
      index: 0,
      value: rest1[0]?.[1] || 0,
    },
    [USER.SECOND]: {
      index: 0,
      value: rest2[0]?.[1] || 0,
    },
  };

  return calculateHighestRest({ rest1, rest2 }, maxes, length);
};

const calculateHighestRest = <
  T extends [key: string, value: number][],
  U extends {
    [USER.FIRST]: {
      index: number;
      value: number;
    };
    [USER.SECOND]: {
      index: number;
      value: number;
    };
  }
>(
  rests: { rest1: T; rest2: T },
  maxes: U,
  length: number
) => {
  const { rest1, rest2 } = rests;
  let result: WinnerResultValueType = 0;

  for (let i = 0; i < length; i++) {
    for (let j = 0; j < rest1.length; j++) {
      if (+rest1[j][0] > maxes[USER.FIRST].value) {
        maxes[USER.FIRST].index = j;
        maxes[USER.FIRST].value = +rest1[j][0];
      }
      if (+rest2[j][0] > maxes[USER.SECOND].value) {
        maxes[USER.SECOND].index = j;
        maxes[USER.SECOND].value = +rest2[j][0];
      }
    }

    if (maxes[USER.FIRST].value !== maxes[USER.SECOND].value) {
      result =
        maxes[USER.FIRST].value > maxes[USER.SECOND].value
          ? USER.FIRST
          : USER.SECOND;
      break;
    }

    rest1.splice(maxes[USER.FIRST].index, 1);
    rest2.splice(maxes[USER.SECOND].index, 1);

    maxes[USER.FIRST].value = 0;
    maxes[USER.SECOND].value = 0;
  }

  return result;
};
