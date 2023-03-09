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

const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);
