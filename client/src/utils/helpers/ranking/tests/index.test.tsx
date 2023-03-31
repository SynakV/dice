import { RANKING_OF_HANDS } from "@utils/constants";
import {
  RANKING_OF_HANDS_KEYS,
  RankingOfTypeValueType,
  RankingResultWithInfoType,
} from "@utils/common/types";
import {
  permute,
  getAllPossibleRepeatedInts,
} from "@utils/helpers/randomizer.helper";
import {
  getRanking,
  getRankingsComparisonWinner,
} from "@utils/helpers/ranking/ranking.helper";

// describe("Ranking tests", () => {
//   Object.keys(RANKING_OF_HANDS).forEach((key) => {
//     let testArrays: number[][] = [];

//     switch (key) {
//       case RANKING_OF_HANDS_KEYS.NOTHING:
//         testArrays = [
//           [1, 3, 4, 5, 6],
//           [1, 2, 4, 5, 6],
//           [1, 2, 3, 5, 6],
//           [1, 2, 3, 4, 6],
//         ];
//         break;
//       case RANKING_OF_HANDS_KEYS.PAIR:
//         testArrays = getAllPossibleRepeatedInts({ repeats: [2] });
//         break;
//       case RANKING_OF_HANDS_KEYS.TWO_PAIRS:
//         testArrays = getAllPossibleRepeatedInts({
//           repeats: [2, 2],
//           key,
//         });
//         break;
//       case RANKING_OF_HANDS_KEYS.THREE_OF_A_KIND:
//         testArrays = getAllPossibleRepeatedInts({ repeats: [3] });
//         break;
//       case RANKING_OF_HANDS_KEYS.FIVE_HIGH_STRAIGHT:
//         testArrays = [[1, 2, 3, 4, 5]];
//         break;
//       case RANKING_OF_HANDS_KEYS.SIX_HIGH_STRAIGHT:
//         testArrays = [[2, 3, 4, 5, 6]];
//         break;
//       case RANKING_OF_HANDS_KEYS.FULL_HOUSE:
//         testArrays = testArrays = getAllPossibleRepeatedInts({
//           repeats: [3, 2],
//           key,
//         });
//         break;
//       case RANKING_OF_HANDS_KEYS.FOUR_OF_A_KIND:
//         testArrays = getAllPossibleRepeatedInts({ repeats: [4] });
//         break;
//       case RANKING_OF_HANDS_KEYS.FIVE_OF_A_KIND:
//         testArrays = getAllPossibleRepeatedInts({ repeats: [5] });
//         break;
//       default:
//         break;
//     }

//     describe(key, () => {
//       for (let array = 0; array < testArrays.length; array++) {
//         const randomizedArray = permute(testArrays[array]);

//         for (let i = 0; i < randomizedArray.length; i++) {
//           it(`${i + 1}: [${randomizedArray[i].toString()}]`, () => {
//             expect(getRankingResult(randomizedArray[i]).key).toEqual(key);
//           });
//         }
//       }
//     });
//   });
// });

// describe("Comparison tests", () => {
//   describe("Tests if ones value is bigger than another", () => {
//     const rankings = Object.values(RANKING_OF_HANDS);

//     const opponents: [RankingOfTypeValueType, RankingOfTypeValueType][] = [];

//     for (let i = 0; i < rankings.length; i++) {
//       for (let j = 0; j < rankings.length; j++) {
//         if (rankings[i] !== rankings[j]) {
//           opponents.push([rankings[i], rankings[j]]);
//         }
//       }
//     }

//     for (let i = 0; i < opponents.length; i++) {
//       const winner =
//         opponents[i][0].value > opponents[i][1].value
//           ? USER.FIRST
//           : USER.SECOND;

//       const dice: DiceType = {
//         [USER.FIRST]: {
//           value: opponents[i][0],
//         } as RankingResultWithInfoType,
//         [USER.SECOND]: {
//           value: opponents[i][1],
//         } as RankingResultWithInfoType,
//       };

//       it(`it should return winner: ${winner}`, () => {
//         expect(getRankingsComparisonWinner(dice)).toEqual(winner);
//       });
//     }
//   });

//   describe("Tests if values are equals", () => {
//     Object.keys(RANKING_OF_HANDS).forEach((key) => {
//       let testRankings: DiceType[] = [];

//       const getEqualRankings = (arrays: number[][]) => {
//         arrays.forEach((array) => {
//           const rankingResult = getRankingResult(
//             array
//           ) as RankingResultWithInfoType;

//           testRankings.push({
//             [USER.FIRST]: rankingResult,
//             [USER.SECOND]: rankingResult,
//           });
//         });
//       };

//       switch (key) {
//         case RANKING_OF_HANDS_KEYS.NOTHING:
//           getEqualRankings([
//             ...permute([1, 3, 4, 5, 6]),
//             ...permute([1, 2, 4, 5, 6]),
//             ...permute([1, 2, 3, 5, 6]),
//             ...permute([1, 2, 3, 4, 6]),
//           ]);
//           break;
//         case RANKING_OF_HANDS_KEYS.PAIR:
//           getEqualRankings(getAllPossibleRepeatedInts({ repeats: [2] }));
//           break;
//         case RANKING_OF_HANDS_KEYS.TWO_PAIRS:
//           getEqualRankings(
//             getAllPossibleRepeatedInts({
//               repeats: [2, 2],
//               key,
//             })
//           );
//           break;
//         case RANKING_OF_HANDS_KEYS.THREE_OF_A_KIND:
//           getEqualRankings(getAllPossibleRepeatedInts({ repeats: [3] }));
//           break;
//         case RANKING_OF_HANDS_KEYS.FIVE_HIGH_STRAIGHT:
//           getEqualRankings([[1, 2, 3, 4, 5]]);
//           break;
//         case RANKING_OF_HANDS_KEYS.SIX_HIGH_STRAIGHT:
//           getEqualRankings([[2, 3, 4, 5, 6]]);
//           break;
//         case RANKING_OF_HANDS_KEYS.FULL_HOUSE:
//           getEqualRankings(
//             getAllPossibleRepeatedInts({
//               repeats: [3, 2],
//               key,
//             })
//           );
//           break;
//         case RANKING_OF_HANDS_KEYS.FOUR_OF_A_KIND:
//           getEqualRankings(getAllPossibleRepeatedInts({ repeats: [4] }));
//           break;
//         case RANKING_OF_HANDS_KEYS.FIVE_OF_A_KIND:
//           getEqualRankings(getAllPossibleRepeatedInts({ repeats: [5] }));
//           break;
//         default:
//           break;
//       }

//       for (let i = 0; i < testRankings.length; i++) {
//         it(`it should return winner: 0`, () => {
//           expect(getRankingsComparisonWinner(testRankings[i])).toEqual(
//             USER.NOBODY
//           );
//         });
//       }
//     });
//   });
// });

describe("Comparison tests", () => {
  it(`3 players winner`, () => {
    const player1: RankingResultWithInfoType | any = getRanking([
      2, 2, 3, 4, 5,
    ]);
    const player2: RankingResultWithInfoType | any = getRanking([
      1, 1, 3, 4, 5,
    ]);
    const player3: RankingResultWithInfoType | any = getRanking([
      2, 2, 3, 4, 6,
    ]);

    player1.player = { name: "Player_1" };
    player2.player = { name: "Player_2" };
    player3.player = { name: "Player_3" };

    const winner = getRankingsComparisonWinner([player1, player2, player3]);

    console.log(winner);
  });
});
