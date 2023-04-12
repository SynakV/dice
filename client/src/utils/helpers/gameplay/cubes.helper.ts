import { playAudio } from "../audio.helper";
import { getRandomInt } from "../randomizer.helper";
import { DeskType, PlayerType } from "@utils/common/types";

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

export const getCurrentRanking = (desk: DeskType, player: PlayerType) => {
  const round = desk.gameplay.rounds[desk.gameplay.current.round];
  const stage = round.stages[desk.gameplay.current.stage];

  const ranking =
    stage.rankings.find((ranking) => ranking.player.name === player.name) ||
    // if no ranking, show ranking from previous stage
    round.stages[desk.gameplay.current.stage - 1]?.rankings.find(
      (ranking) => ranking.player.name === player.name
    ) ||
    // if no ranking, show ranking from last stage of previous round
    desk.gameplay.rounds[desk.gameplay.current.round - 1]?.stages
      .at(-1)
      ?.rankings.find((ranking) => ranking.player.name === player.name);

  return ranking;
};
