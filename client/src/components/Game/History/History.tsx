import React, { Fragment } from "react";
import { useGame } from "@utils/contexts/GameContext";
import { useDesk } from "@utils/contexts/DeskContext";
import { Modal } from "@components/Shared/Modal/Modal";
import { getWinnersNamesString } from "@utils/helpers/ranking/ranking.helper";

export const History = () => {
  const { desk } = useDesk();
  const { isHistoryOpen, toggleHistoryOpen } = useGame();

  const rounds = desk.gameplay.rounds;

  const isAtLeastFirstRoundStageCompleted = rounds[0].stages[0].isCompleted;

  return (
    <Modal className="history" title="History" isOpen={isHistoryOpen}>
      {isAtLeastFirstRoundStageCompleted ? (
        <ul>
          {rounds.map((round, index) => {
            const roundWinner = getWinnersNamesString(round.winners);
            const isAtLeastFirstRoundStageCompleted =
              round.stages[0].isCompleted;
            return (
              isAtLeastFirstRoundStageCompleted && (
                <Fragment key={index}>
                  <li>
                    Round: {index + 1}{" "}
                    {roundWinner ? `(Winner: ${roundWinner})` : ""}
                  </li>
                  <ul>
                    {round.stages.map((stage, index) => {
                      const isStageFinished = stage.isCompleted;
                      return (
                        isStageFinished && (
                          <Fragment key={index}>
                            <li>
                              {index === 0 ? `Roll` : "Re-roll"} (Winner:{" "}
                              {getWinnersNamesString(stage.winners)})
                            </li>
                            <ul>
                              {stage.rankings.map((ranking, index) => (
                                <li key={index}>
                                  {ranking.player.name}: {ranking.value.name} -{" "}
                                  {ranking.cubes?.toString()}
                                </li>
                              ))}
                            </ul>
                          </Fragment>
                        )
                      );
                    })}
                  </ul>
                </Fragment>
              )
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
