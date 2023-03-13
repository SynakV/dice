import { DICE } from "@utils/constants";

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
