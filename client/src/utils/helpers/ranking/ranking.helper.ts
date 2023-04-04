import {
  RoundType,
  PlayerType,
  StructuredType,
  RankingResultType,
  RANKING_OF_HANDS_KEYS,
  RankingResultWithInfoType,
} from "@utils/common/types";
import { DICE, RANKING_OF_HANDS } from "@utils/constants";
import { getAppearedNumbers } from "@utils/helpers/ranking/calculations.helper";

export const getRanking = (numbers: number[]): RankingResultType => {
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
  rankings: RankingResultWithInfoType[]
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
  const winners = Object.entries(getWinTotals(rounds)).filter(
    ([_, total]) => total === wins
  );

  return winners.length ? winners : false;
};

export const getWinTotals = (rounds: RoundType[]) => {
  const totals: { [name: string]: number } = {};

  for (let i = 0; i < rounds.length; i++) {
    if (!rounds[i].isCompleted) {
      continue;
    }

    rounds[i].winners?.forEach(({ name }) => {
      const winnerName = name || "";
      if (!(winnerName in totals)) {
        totals[winnerName] = 1;
      } else {
        totals[winnerName]++;
      }
    });
  }

  return totals;
};

export const getWinnersNamesArray = (winners?: PlayerType[]) =>
  winners?.map(({ name }) => name);

export const getWinnersNamesString = (winners?: PlayerType[]) =>
  getWinnersNamesArray(winners)?.join(", ") || "";

const getFullHouseWinners = (
  maxPlayersRankings: RankingResultWithInfoType[]
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

const getTwoPairsWinners = (
  maxPlayersRankings: RankingResultWithInfoType[]
) => {
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

const getOfAKindWinners = (maxPlayersRankings: RankingResultWithInfoType[]) => {
  const ofAKindValues: [PlayerType, number][] = [];
  const rest: [PlayerType, [string, number][]][] = [];

  maxPlayersRankings.forEach((ranking) => {
    ofAKindValues.push([ranking.player, +ranking.result.appeared[0][0]]);
    rest.push([ranking.player, ranking.result.rest]);
  });

  const isAllValuesSame = ofAKindValues.every(
    ([_, value]) => value === ofAKindValues[0][1]
  );

  return isAllValuesSame
    ? getHighestRestPlayers(rest)
    : getMaxAppeared(ofAKindValues).map(([player]) => player);
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

const getMaxAppeared = (appeares: [PlayerType, number][]) => {
  let maxAppeared = appeares[0][1];

  appeares.forEach((appeared) => {
    if (appeared[1] > maxAppeared) {
      maxAppeared = appeared[1];
    }
  });

  return appeares.filter((appeared) => appeared[1] === maxAppeared);
};

export const findMaxPlayersRankings = (
  rankings: RankingResultWithInfoType[]
) => {
  const max = Math.max(...rankings.map((ranking) => ranking.value.value));
  return rankings.filter((ranking) => ranking.value.value === max);
};

export const getReRollIndexes = (
  cubes: number[],
  ranking: RankingResultType
) => {
  if (ranking.key === RANKING_OF_HANDS_KEYS.NOTHING) {
    return new Array(DICE.COUNT).fill(null).map((_, index) => index);
  }

  if (!ranking.result.rest) {
    return [];
  }

  const rest = ranking.result.rest;

  if (rest) {
    const restNumbers = rest.map((number) => +number[0]);
    const indexes = [];

    for (let i = 0; i < cubes.length; i++) {
      if (restNumbers.includes(cubes[i])) {
        indexes.push(i);
      }
    }

    return indexes;
  } else {
    return [];
  }
};
