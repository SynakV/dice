import React, { FC, Fragment } from "react";
import { useGame } from "@src/utils/contexts/GameContext";
import { Modal } from "@src/components/Shared/Modal/Modal";
import { HistoryType, ROUND_STAGE, USER } from "@utils/common/types";

interface Props {
  history?: HistoryType | null;
}

export const History: FC<Props> = ({ history }) => {
  const { isHistoryOpen, toggleHistoryOpen } = useGame();

  return (
    <Modal className="history" title="History" isOpen={isHistoryOpen}>
      {history ? (
        <ul>
          {Object.entries(history).map(([round, result]) => {
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
