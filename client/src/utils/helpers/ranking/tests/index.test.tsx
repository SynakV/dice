import { RANKING_OF_HANDS } from "@utils/constants";
import { RANKING_OF_HANDS_KEYS } from "@utils/types";
import { permute } from "@utils/helpers/randomizer.helper";
import { getRankingResult } from "@utils/helpers/ranking/ranking.helper";

describe("Basic ranking tests", () => {
  Object.keys(RANKING_OF_HANDS).forEach((key) => {
    let testArray: number[] = [];

    switch (key) {
      case RANKING_OF_HANDS_KEYS.NOTHING:
        testArray = [1, 2, 3, 4, 6];
        break;
      case RANKING_OF_HANDS_KEYS.PAIR:
        testArray = [1, 1, 2, 3, 4];
        break;
      case RANKING_OF_HANDS_KEYS.TWO_PAIRS:
        testArray = [1, 1, 2, 2, 3];
        break;
      case RANKING_OF_HANDS_KEYS.THREE_OF_A_KIND:
        testArray = [1, 1, 1, 2, 3];
        break;
      case RANKING_OF_HANDS_KEYS.FIVE_HIGH_STRAIGHT:
        testArray = [1, 2, 3, 4, 5];
        break;
      case RANKING_OF_HANDS_KEYS.SIX_HIGH_STRAIGHT:
        testArray = [2, 3, 4, 5, 6];
        break;
      case RANKING_OF_HANDS_KEYS.FULL_HOUSE:
        testArray = [1, 1, 1, 2, 2];
        break;
      case RANKING_OF_HANDS_KEYS.FOUR_OF_A_KIND:
        testArray = [1, 1, 1, 1, 2];
        break;
      case RANKING_OF_HANDS_KEYS.FIVE_OF_A_KIND:
        testArray = [1, 1, 1, 1, 1];
        break;
      default:
        break;
    }

    describe(key, () => {
      const randomizedArray = permute(testArray);

      for (let i = 0; i < randomizedArray.length; i++) {
        it(`${i + 1}: [${randomizedArray[i].toString()}]`, () => {
          expect(getRankingResult(randomizedArray[i]).key).toEqual(key);
        });
      }
    });
  });
});

// describe("Basic winner tests", () => {
//   it(`Description`, () => {
//     expect(1).toEqual(1);
//   });
// });
