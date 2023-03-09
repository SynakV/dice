import { RANKING_OF_HANDS_KEYS } from "@utils/types";
import { getRankingResult } from "@utils/helpers/ranking/ranking.helper";

describe("Rankings", () => {
  describe(RANKING_OF_HANDS_KEYS.PAIR, () => {
    it("should correctry calculate: [1, 1, 3, 4, 5] ", () => {
      expect(getRankingResult([1, 1, 3, 4, 5]).key).toEqual(
        RANKING_OF_HANDS_KEYS.PAIR
      );
    });

    it("should correctry calculate: [2, 2, 3, 4, 5] ", () => {
      expect(getRankingResult([2, 2, 3, 4, 5]).key).toEqual(
        RANKING_OF_HANDS_KEYS.PAIR
      );
    });

    it("should correctry calculate: [1, 2, 3, 2, 5] ", () => {
      expect(getRankingResult([1, 2, 3, 2, 5]).key).toEqual(
        RANKING_OF_HANDS_KEYS.PAIR
      );
    });

    it("should correctry calculate: [1, 2, 3, 5, 1] ", () => {
      expect(getRankingResult([1, 2, 3, 5, 1]).key).toEqual(
        RANKING_OF_HANDS_KEYS.PAIR
      );
    });

    it("should correctry calculate: [1, 2, 3, 1, 5] ", () => {
      expect(getRankingResult([1, 2, 3, 1, 5]).key).toEqual(
        RANKING_OF_HANDS_KEYS.PAIR
      );
    });
  });

  describe(RANKING_OF_HANDS_KEYS.FIVE_HIGH_STRAIGHT, () => {
    it("should correctry calculate: [1, 2, 3, 4, 5] ", () => {
      expect(getRankingResult([1, 2, 3, 4, 5]).key).toEqual(
        RANKING_OF_HANDS_KEYS.FIVE_HIGH_STRAIGHT
      );
    });
  });
});
