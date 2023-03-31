import { playAudio } from "../audio.helper";
import { getRandomInt } from "../randomizer.helper";

export const getCubesReroll = (
  index: number | number[],
  cubesReroll: (number | null)[]
) => {
  const copy = [...cubesReroll];

  if (Array.isArray(index)) {
    // Computer
    for (let i = 0; i < index.length; i++) {
      copy.splice(index[i], 1, getRandomInt());
    }
    return copy;
  } else {
    // User
    if (copy[index]) {
      copy.splice(index, 1, null);
    } else {
      copy[index] = getRandomInt();
    }
  }

  playAudio("selectDieForReroll");

  return copy;
};

export const getDiceForReroll = (
  cubes: number[],
  cubesReroll: (number | null)[],
  computerCubesReloll?: (number | null)[]
) => {
  const cubersForReroll = computerCubesReloll || cubesReroll;

  const newCubes: number[] = [];

  for (let i = 0; i < cubersForReroll.length; i++) {
    newCubes.push(cubersForReroll[i] ? cubersForReroll[i]! : cubes[i]);
  }

  return newCubes;
};
