import { DICE } from "@utils/constants";
import { RANKING_OF_HANDS_KEYS } from "@utils/common/types";

export const getRandomIntsFromInterval = (
  randomNumbersCount: number = DICE.COUNT,
  [min, max]: [number, number] = [DICE.RANGE.MIN, DICE.RANGE.MAX]
) => {
  const randomNumbers = [];

  for (let i = 0; i < randomNumbersCount; i++) {
    randomNumbers.push(getRandomInt(min, max));
  }

  return randomNumbers;
};

export const permute = (arr: number[], start = 0, result: number[][] = []) => {
  if (start === arr.length - 1) {
    result.push([...arr]);
  } else {
    for (let i = start; i < arr.length; i++) {
      [arr[start], arr[i]] = [arr[i], arr[start]];
      permute(arr, start + 1, result);
      [arr[start], arr[i]] = [arr[i], arr[start]];
    }
  }
  return result;
};

export const getRandomInt = (
  min: number = DICE.RANGE.MIN,
  max: number = DICE.RANGE.MAX
) => Math.floor(Math.random() * (max - min + 1) + min);

export const getRepeatedInts = (
  options: {
    [key: number]: number;
  },
  max: number = 5
) => {
  const array: number[] = [];

  const keys = Object.keys(options);
  const values = Object.values(options);

  for (let i = 0; i < keys.length; i++) {
    array.push(...new Array(+values[i]).fill(+keys[i]));
  }

  while (array.length < max) {
    const randomInt = getRandomInt();

    if (!array.includes(randomInt)) {
      array.push(randomInt);
    }
  }

  return array;
};

export const getAllPossibleRepeatedInts = (options: {
  repeats?: [number, number?];
  key?: RANKING_OF_HANDS_KEYS;
}) => {
  const arrays: number[][] = [];

  const { repeats, key } = options;

  for (let i = DICE.RANGE.MIN; i <= DICE.RANGE.MAX; i++) {
    if (
      key === RANKING_OF_HANDS_KEYS.TWO_PAIRS ||
      key === RANKING_OF_HANDS_KEYS.FULL_HOUSE
    ) {
      for (let j = DICE.RANGE.MIN; j <= DICE.RANGE.MAX; j++) {
        if (i !== j) {
          arrays.push(
            getRepeatedInts({
              [i]: repeats?.[0]!,
              [j]: repeats?.[1]!,
            })
          );
        }
      }
      continue;
    }

    arrays.push(
      getRepeatedInts({
        [i]: repeats?.[0]!,
      })
    );
  }

  return arrays;
};

export const shuffleArray = (arr: any[]) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
};
