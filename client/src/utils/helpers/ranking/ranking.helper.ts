import { RANKING_OF_HANDS_KEYS } from "@src/utils/types";
import { RANKING_OF_HANDS } from "@utils/constants";
import { getAppearedNumbers } from "./calculations.helper";

export const getRankingResult = (numbers: number[]) => {
  const appeared = getAppearedNumbers(numbers);

  let ranking: any;

  Object.entries(RANKING_OF_HANDS).find(([key, value]) => {
    const result = value.function(appeared);

    if (result) {
      ranking = {
        key,
        value,
        result,
      };
    }
  });

  return (
    ranking || {
      key: RANKING_OF_HANDS_KEYS.NOTHING,
      value: RANKING_OF_HANDS.nothing,
      result: null,
    }
  );
};
