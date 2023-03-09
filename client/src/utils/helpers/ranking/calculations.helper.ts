import { AppearedType } from "@src/utils/types";

export const getAppearedNumbers = (numbers: number[]) => {
  const appeared: { [key: number]: number } = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  };

  for (let i = 0; i < numbers.length; i++) {
    appeared[numbers[i]]++;
  }

  return Object.entries(appeared);
};

const getHighStraight = (
  appeared: [string, number][],
  [min, max]: [number, number],
  checkForZero: number
) => {
  for (let i = min; i < max; i++) {
    if (appeared[i - 1][1] !== 1) {
      return false;
    }
  }
  return appeared.at(checkForZero - 1)?.[1] === 0 && appeared;
};

const getFilteredOccurrences = (
  appeared: AppearedType,
  occurrences: number
) => {
  const filtered = appeared.filter(([_, value]) => value === occurrences);
  return filtered;
};

export const isNothing = (_: AppearedType) => false;

export const isPair = (appeared: AppearedType) => {
  const pairOccurrences = getFilteredOccurrences(appeared, 2);
  const tripleOccurrences = getFilteredOccurrences(appeared, 3);
  const isFound =
    pairOccurrences.length === 1 && tripleOccurrences.length !== 1;

  return isFound ? pairOccurrences : false;
};

export const isTwoPairs = (appeared: AppearedType) => {
  const pairOccurrences = getFilteredOccurrences(appeared, 2);
  const isFound = pairOccurrences.length === 2;
  return isFound ? pairOccurrences : false;
};

export const isThreeOfAKind = (appeared: AppearedType) => {
  const tripleOccurrences = getFilteredOccurrences(appeared, 3);
  const pairOccurrences = getFilteredOccurrences(appeared, 2);
  const isFound =
    tripleOccurrences.length === 1 && pairOccurrences.length !== 1;

  return isFound ? tripleOccurrences : false;
};

export const isFiveHighStraight = (appeared: AppearedType) => {
  return getHighStraight(appeared, [1, 5], 6);
};

export const isSixHighStraight = (appeared: AppearedType) => {
  return getHighStraight(appeared, [2, 6], 1);
};

export const isFullHouse = (appeared: AppearedType) => {
  const tripleOccurrences = getFilteredOccurrences(appeared, 3);
  const pairOccurrences = getFilteredOccurrences(appeared, 2);
  const isFound =
    tripleOccurrences.length === 1 && pairOccurrences.length === 1;

  return isFound
    ? {
        triple: tripleOccurrences,
        pair: pairOccurrences,
      }
    : false;
};

export const isFourOfAKind = (appeared: AppearedType) => {
  const quartetOccurrences = getFilteredOccurrences(appeared, 4);
  const isFound = quartetOccurrences.length === 1;
  return isFound ? quartetOccurrences : false;
};

export const isFiveOfAKind = (appeared: AppearedType) => {
  const quintetOccurrences = getFilteredOccurrences(appeared, 5);
  const isFound = quintetOccurrences.length === 1;
  return isFound ? quintetOccurrences : false;
};
