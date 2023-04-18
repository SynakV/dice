import { DICE } from "@utils/constants";
import { getRandomInt } from "@utils/helpers/randomizer.helper";
import {
  DeskType,
  CubesType,
  PlayerType,
  RerollType,
} from "@utils/common/types";

export const DEFAULT_CUBES: null[] = new Array(DICE.COUNT).fill(null);

export const getCubesReroll = (
  index: number | number[],
  { roll, reroll }: CubesType
) => {
  const selectedDice = [...(reroll || DEFAULT_CUBES)];

  if (Array.isArray(index)) {
    for (let i = 0; i < index.length; i++) {
      selectedDice[index[i]] = !selectedDice[index[i]]
        ? roll?.[index[i]] || null
        : null;
    }
  } else {
    selectedDice[index] = !selectedDice[index] ? roll?.[index] || null : null;
  }

  return selectedDice;
};

export const getDiceForReroll = ({ roll, reroll }: CubesType) => {
  const newCubes: number[] = [];

  if (!roll || !reroll) {
    return roll;
  }

  for (let i = 0; i < reroll.length; i++) {
    newCubes.push(reroll[i] ? getRandomInt() : roll[i]);
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

export const isPass = (reroll?: RerollType) =>
  !reroll || reroll.every((cube) => cube === null);
