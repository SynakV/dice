import React, { Fragment, useEffect } from "react";
import { ROUND_STAGE, USER } from "@utils/common/types";
import { useGame } from "@src/utils/contexts/GameContext";
import { useDesk } from "@src/utils/contexts/DeskContext";
import { Modal } from "@src/components/Shared/Modal/Modal";
import { afterSaveHistory } from "@src/utils/helpers/gameplay/gameplay.helper";
import { getComparisonResult } from "@src/utils/helpers/ranking/ranking.helper";

export const History = () => {
  const { desk, setDesk } = useDesk();
  const { isHistoryOpen, toggleHistoryOpen } = useGame();

  useEffect(() => {
    // Don't save histoty until second user throw
    if (!desk?.gameplay?.result?.[USER.SECOND]) {
      return;
    }

    if (
      desk.gameplay.result[USER.FIRST].stage ===
      desk.gameplay.result[USER.SECOND].stage
    ) {
      const stageWinner = getComparisonResult(desk.gameplay.result);
      setDesk((prev) => afterSaveHistory(prev, desk, stageWinner));
    }
  }, [desk?.gameplay?.result]);

  return (
    <Modal className="history" title="History" isOpen={isHistoryOpen}>
      {desk?.gameplay?.history ? (
        <ul>
          {Object.entries(desk.gameplay.history).map(([round, result]) => {
            const roundWinner =
              result?.[ROUND_STAGE.END]?.round?.stage?.winner?.toString();
            return (
              <Fragment key={round}>
                <li>
                  Round: {+round + 1}{" "}
                  {roundWinner ? `(Winner: ${+roundWinner})` : ""}
                </li>
                <ul>
                  {Object.entries(result).map(([stage, user]) => {
                    return (
                      <Fragment key={stage}>
                        <li>
                          {+stage === 0 ? `Roll` : "Re-roll"} (Winner:{" "}
                          {user.round?.stage?.winner})
                        </li>
                        <ul>
                          <li>
                            {user?.result?.[USER.FIRST]?.value.name} [
                            {user?.result?.[USER.FIRST]?.cubes?.toString()}] -{" "}
                            {user?.result?.[USER.SECOND]?.value.name} [
                            {user?.result?.[USER.SECOND]?.cubes?.toString()}]
                          </li>
                        </ul>
                      </Fragment>
                    );
                  })}
                </ul>
              </Fragment>
            );
          })}
        </ul>
      ) : (
        <span className="history__no-data">No data</span>
      )}

      <div onClick={toggleHistoryOpen} className="history__button">
        Close
      </div>
    </Modal>
  );
};
