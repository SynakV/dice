import { DICE } from "@utils/constants";
import { AppearedType, StructuredType } from "@utils/common/types";

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
  for (let i = 0; i < DICE.COUNT; i++) {
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
