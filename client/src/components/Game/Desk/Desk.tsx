import React, { useEffect } from "react";
import { useDesk } from "@utils/contexts/DeskContext";
import { useGame } from "@utils/contexts/GameContext";
import { USER, ROUND_STAGE } from "@utils/common/types";
import { Cubes } from "@components/Game/Desk/Cubes/Cubes";
import { getComparisonResult } from "@utils/helpers/ranking/ranking.helper";
import {
  afterEndGame,
  afterEndRound,
} from "@utils/helpers/gameplay/gameplay.helper";

export const Desk = () => {
  const { refreshGame } = useGame();
  const { desk, setDesk } = useDesk();

  useEffect(() => {
    if (
      desk?.gameplay?.result?.[USER.FIRST]?.stage === ROUND_STAGE.END &&
      desk?.gameplay?.result?.[USER.SECOND]?.stage === ROUND_STAGE.END
    ) {
      const roundWinner = getComparisonResult(desk.gameplay.result);
      setDesk((prev) => afterEndRound(prev, roundWinner));
    }
  }, [desk?.gameplay?.result, desk?.gameplay?.round]);

  useEffect(() => {
    if (desk?.gameplay?.isGameEnded) {
      refreshGame();
      setDesk(afterEndGame);
    }
  }, [desk?.gameplay?.isGameEnded]);

  return (
    <div className="desk">
      <div className="desk__cubes">
        <Cubes user={USER.FIRST} />
        <Cubes user={USER.SECOND} />
      </div>
    </div>
  );
};
