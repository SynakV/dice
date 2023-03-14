import React, { FC, Fragment } from "react";
import { Modal } from "@src/components/Modal/Modal";
import { HistoryType, USER } from "@src/utils/types";

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
            return (
              <Fragment key={round}>
                <li>Round: {+round + 1}</li>
                <ul>
                  {Object.entries(result).map(([stage, user]) => {
                    return (
                      <Fragment key={stage}>
                        <li>Stage: {+stage + 1}</li>
                        <ul>
                          <li>
                            {user?.[USER.FIRST].value.name} [
                            {user?.[USER.FIRST].cubes?.toString()}] -{" "}
                            {user?.[USER.SECOND].value.name} [
                            {user?.[USER.SECOND].cubes?.toString()}]
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
