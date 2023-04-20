import {
  RoundType,
  PlayerType,
  RankingType,
  StructuredType,
  RankingWithInfoType,
  RANKING_OF_HANDS_KEYS,
} from "@utils/common/types";
import { DICE, RANKING_OF_HANDS } from "@utils/constants";
import { getAppearedNumbers } from "@utils/helpers/ranking/calculations.helper";

export const getRanking = (numbers: number[]): RankingType => {
  const appeared = getAppearedNumbers(numbers);

  let ranking: any;

  Object.entries(RANKING_OF_HANDS).find(([key, value]) => {
    const result: StructuredType | false = value.function(appeared);

    if (result) {
      return (ranking = {
        key,
        value,
        result,
      });
    }
  });

  return (
    ranking || {
      key: RANKING_OF_HANDS_KEYS.NOTHING,
      value: RANKING_OF_HANDS.nothing,
      result: { appeared },
    }
  );
};

export const getRankingsComparisonWinner = (
  rankings: RankingWithInfoType[]
): PlayerType[] => {
  const maxPlayersRankings = findMaxPlayersRankings(rankings);

  if (maxPlayersRankings.length > 1) {
    const ranking = maxPlayersRankings[0];

    if (
      ranking.key === RANKING_OF_HANDS_KEYS.PAIR ||
      ranking.key === RANKING_OF_HANDS_KEYS.THREE_OF_A_KIND ||
      ranking.key === RANKING_OF_HANDS_KEYS.FOUR_OF_A_KIND ||
      ranking.key === RANKING_OF_HANDS_KEYS.FIVE_OF_A_KIND
    ) {
      return getOfAKindWinners(maxPlayersRankings);
    }

    if (ranking.key === RANKING_OF_HANDS_KEYS.TWO_PAIRS) {
      return getTwoPairsWinners(maxPlayersRankings);
    }

    if (ranking.key === RANKING_OF_HANDS_KEYS.FULL_HOUSE) {
      return getFullHouseWinners(maxPlayersRankings);
    }

    return maxPlayersRankings.map(({ player }) => player);
  }

  return maxPlayersRankings.map(({ player }) => player);
};

export const getGameWinner = (rounds: RoundType[], wins: number) => {
  const winners = Object.values(getWinTotals(rounds)).filter(
    (total) => total === wins
  );

  return winners.length ? winners : false;
};

export const getWinTotals = (rounds: RoundType[]) => {
  const totals: { [id: string]: number } = {};

  for (let i = 0; i < rounds.length; i++) {
    if (!rounds[i].isCompleted) {
      continue;
    }

    rounds[i].winners.forEach(({ id }) => {
      if (!(id in totals)) {
        totals[id] = 1;
      } else {
        totals[id]++;
      }
    });
  }

  return totals;
};

export const getWinnersNamesArray = (winners: PlayerType[]) =>
  winners.map(({ name }) => name);

export const getWinnersNamesString = (winners: PlayerType[]) =>
  getWinnersNamesArray(winners).join(", ") || "";

export const getWinnersNounString = (winnersNames: string) =>
  `Winner${winnersNames.includes(", ") ? "s" : ""}: ${winnersNames}`;

const getFullHouseWinners = (
  maxPlayersRankings: RankingWithInfoType[]
): PlayerType[] => {
  const appeares: [PlayerType, [string, number][]][] = [];
  const triples: [PlayerType, number][] = [];
  const pairs: [PlayerType, number][] = [];

  maxPlayersRankings.forEach((ranking) => {
    appeares.push([ranking.player, ranking.result.appeared]);
  });

  appeares.forEach(([player, appeared]) => {
    triples.push([player, +(appeared as any).triple.appeared[0][0]]);
    pairs.push([player, +(appeared as any).pair.appeared[0][0]]);
  });

  const isAllTriplesSame = appeares.every(
    ([_, appeared]) =>
      +(appeared as any).triple.appeared[0][0] ===
      +(appeares[0][1] as any).triple.appeared[0][0]
  );

  const isAllPairsSame = appeares.every(
    ([_, appeared]) =>
      +(appeared as any).pair.appeared[0][0] ===
      +(appeares[0][1] as any).pair.appeared[0][0]
  );

  if (isAllTriplesSame) {
    if (isAllPairsSame) {
      return maxPlayersRankings.map((ranking) => ranking.player);
    }

    return getMaxAppeared(pairs).map(([player]) => player);
  }

  return getMaxAppeared(triples).map(([player]) => player);
};

const getTwoPairsWinners = (maxPlayersRankings: RankingWithInfoType[]) => {
  const appeares: [PlayerType, [string, number][]][] = [];
  const rests: [PlayerType, [string, number][]][] = [];

  maxPlayersRankings.forEach((ranking) => {
    appeares.push([ranking.player, ranking.result.appeared]);
    rests.push([ranking.player, ranking.result.rest]);
  });

  const hightAmongAppeared = getHighestRestPlayers(appeares);

  return hightAmongAppeared.length === maxPlayersRankings.length
    ? getHighestRestPlayers(rests)
    : hightAmongAppeared;
};

const getOfAKindWinners = (maxPlayersRankings: RankingWithInfoType[]) => {
  const appeared: [PlayerType, number][] = [];
  const rest: [PlayerType, [string, number][]][] = [];

  maxPlayersRankings.forEach((ranking) => {
    appeared.push([ranking.player, +ranking.result.appeared[0][0]]);
    rest.push([ranking.player, ranking.result.rest]);
  });

  const isAllValuesSame = appeared.every(
    ([_, value]) => value === appeared[0][1]
  );

  return isAllValuesSame
    ? getHighestRestPlayers(rest)
    : getMaxAppeared(appeared, rest).map(([player]) => player);
};

const getHighestRestPlayers = (
  playersWithRests: [PlayerType, [string, number][]][]
) => {
  const playersRestsLength = playersWithRests[0][1].length;

  let max = 0;

  for (let i = 0; i < playersRestsLength; i++) {
    for (let j = 0; j < playersWithRests[0][1].length; j++) {
      for (let k = 0; k < playersWithRests.length; k++) {
        const value = +playersWithRests[k][1][j]?.[0];

        if (value > max) {
          max = value;
        }
      }
    }

    playersWithRests = playersWithRests.filter((playerWithRest) => {
      if (playerWithRest[1].some(([key]) => +key === max)) {
        playerWithRest[1] = playerWithRest[1].filter(([key]) => +key !== max);
        return true;
      }
    });

    if (playersWithRests.length === 1) {
      break;
    }

    max = 0;
  }

  return playersWithRests.map(([player]) => player);
};

const getMaxAppeared = (
  appeares: [PlayerType, number][],
  rest?: [PlayerType, [string, number][]][]
) => {
  let maxAppeared = appeares[0][1];

  appeares.forEach((appeared) => {
    if (appeared[1] > maxAppeared) {
      maxAppeared = appeared[1];
    }
  });

  const playersAppeares = appeares.filter(
    (appeared) => appeared[1] === maxAppeared
  );

  if (playersAppeares.length === 1) {
    return playersAppeares;
  }

  return rest
    ? getHighestRestPlayers(rest).map((player) => [player])
    : playersAppeares;
};

export const findMaxPlayersRankings = (rankings: RankingWithInfoType[]) => {
  const max = Math.max(...rankings.map((ranking) => ranking.value.value));
  return rankings.filter((ranking) => ranking.value.value === max);
};

export const getReRollIndexes = ({
  key,
  cubes,
  result,
}: RankingWithInfoType) => {
  if (key === RANKING_OF_HANDS_KEYS.NOTHING) {
    return new Array(DICE.COUNT).fill(null).map((_, index) => index);
  }

  if (!result.rest) {
    return [];
  }

  const rest = result.rest;
  const roll = cubes.roll || [];

  if (rest) {
    const restNumbers = rest.map((number) => +number[0]);
    const indexes = [];

    for (let i = 0; i < roll.length; i++) {
      if (restNumbers.includes(roll[i])) {
        indexes.push(i);
      }
    }

    return indexes;
  } else {
    return [];
  }
};
