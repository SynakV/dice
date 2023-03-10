export const getRandomIntsFromInterval = (
  randomNumbersCount: number,
  [min, max]: [number, number]
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

const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);
