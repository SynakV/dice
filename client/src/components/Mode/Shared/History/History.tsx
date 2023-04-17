import React, { Fragment, useEffect } from "react";
import { Cube } from "../Game/Desk/Cubes/Cube/Cube";
import { useDesk } from "@utils/contexts/DeskContext";
import { Modal } from "@components/Shared/Modal/Modal";
import { GAME_OPEN, useGame } from "@utils/contexts/GameContext";
import { getWinnersNamesString } from "@utils/helpers/ranking/ranking.helper";

export const History = () => {
  const { desk } = useDesk();
  const { gameOpen, toggleGameOpen } = useGame();

  const rounds = desk.gameplay.rounds;
  const currentRound = desk.gameplay.current.round;

  const isAtLeastFirstRoundStageCompleted = rounds[0].stages[0].isCompleted;

  useEffect(() => {
    if (gameOpen[GAME_OPEN.HISTORY] && currentRound !== 0) {
      setTimeout(() => {
        const hostoryRoundsEl = document.getElementById("history__rounds");
        const historyRoundEl = document.getElementById(`round-${currentRound}`);
        hostoryRoundsEl?.scrollTo({
          top: (historyRoundEl?.offsetTop || 70) - 70,
          behavior: "smooth",
        });
      }, 0);
    }
  }, [gameOpen]);

  return (
    <Modal
      className="history"
      title="History"
      isOpen={gameOpen[GAME_OPEN.HISTORY]}
    >
      {isAtLeastFirstRoundStageCompleted ? (
        <div className="history__rounds" id="history__rounds">
          {rounds.map((round, roundIndex) => {
            const roundWinner = getWinnersNamesString(round.winners);
            const isAtLeastFirstRoundStageCompleted =
              round.stages[0].isCompleted;
            const roundId = `round-${roundIndex}`;
            return (
              isAtLeastFirstRoundStageCompleted && (
                <Fragment key={roundIndex}>
                  <div className="history__round" id={roundId}>
                    Round: {roundIndex + 1}{" "}
                    {roundWinner ? `(Winner: ${roundWinner})` : ""}
                  </div>
                  {round.stages.map((stage, stageIndex) => {
                    const isStageFinished = stage.isCompleted;
                    return (
                      isStageFinished && (
                        <Fragment key={stageIndex}>
                          <div className="history__stage">
                            {stageIndex === 0 ? `Roll` : "Re-roll"} (Winner:{" "}
                            {getWinnersNamesString(stage.winners)})
                          </div>
                          {stage.rankings.map((ranking, rankingIndex) => {
                            const { cubes, value, player } = ranking;
                            const reroll =
                              round.stages[stageIndex - 1]?.rankings[
                                rankingIndex
                              ]?.cubes.reroll;
                            return (
                              <div
                                className="history__ranking"
                                key={rankingIndex}
                              >
                                <div className="history__header">
                                  <span className="history__player">
                                    {player.name}
                                  </span>
                                  <span className="history__value">
                                    {value.name}
                                  </span>
                                </div>
                                <div className="history__cubes">
                                  {cubes.roll?.map((cube, index) => (
                                    <Cube
                                      isDisabled
                                      key={index}
                                      value={cube}
                                      isSelected={!!reroll?.[index]}
                                      wrapperClassName="history__cube-wrapper"
                                    />
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </Fragment>
                      )
                    );
                  })}
                </Fragment>
              )
            );
          })}
        </div>
      ) : (
        <span className="history__no-data">No data</span>
      )}

      <div
        className="history__button"
        onClick={() => toggleGameOpen(GAME_OPEN.HISTORY)}
      >
        Close
      </div>
    </Modal>
  );
};
