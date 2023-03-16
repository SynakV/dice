import React, { FC, Fragment } from "react";
import { Modal } from "@src/components/Modal/Modal";
import { HistoryType, ROUND_STAGE, USER } from "@src/utils/types";

interface Props {
  isOpen: boolean;
  toggleHistory: () => void;
  history: HistoryType | null;
}

export const History: FC<Props> = ({ isOpen, history, toggleHistory }) => {
  return (
    <Modal className="history" title="History" isOpen={isOpen}>
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
                            {user?.result?.[USER.FIRST].value.name} [
                            {user?.result?.[USER.FIRST].cubes?.toString()}] -{" "}
                            {user?.result?.[USER.SECOND].value.name} [
                            {user?.result?.[USER.SECOND].cubes?.toString()}]
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

      <div onClick={toggleHistory} className="history__button">
        Close
      </div>
    </Modal>
  );
};
