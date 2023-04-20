import React, { Fragment, useEffect } from "react";
import { useDesk } from "@utils/contexts/DeskContext";
import { Modal } from "@components/Shared/Modal/Modal";
import {
  getWinnersNamesString,
  getWinnersNounString,
} from "@utils/helpers/ranking/ranking.helper";
import { Hand } from "@components/Mode/Shared/Desk/Hand/Hand";
import { Cube } from "@components/Mode/Shared/Desk/Cube/Cube";
import { GAME_OPEN, useGame } from "@utils/contexts/GameContext";

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
            const roundWinners = getWinnersNamesString(round.winners);
            const roundWinnersNoun = getWinnersNounString(roundWinners);
            const isAtLeastFirstRoundStageCompleted =
              round.stages[0].isCompleted;
            const roundId = `round-${roundIndex}`;
            return (
              isAtLeastFirstRoundStageCompleted && (
                <Fragment key={roundIndex}>
                  <div className="history__round" id={roundId}>
                    Round: {roundIndex + 1}{" "}
                    {roundWinners ? `(${roundWinnersNoun})` : null}
                  </div>
                  {round.stages.map((stage, stageIndex) => {
                    const isStageFinished = stage.isCompleted;
                    const stageWinners = getWinnersNounString(
                      getWinnersNamesString(stage.winners)
                    );
                    return (
                      isStageFinished && (
                        <Fragment key={stageIndex}>
                          <div className="history__stage">
                            {stageIndex === 0 ? `Roll` : "Re-roll"} (
                            {stageWinners})
                          </div>
                          {stage.rankings.map((ranking, rankingIndex) => {
                            const {
                              value,
                              player,
                              cubes: { roll, reroll },
                            } = ranking;
                            return (
                              <Hand
                                key={rankingIndex}
                                ranking={value.name}
                                player={player.name}
                              >
                                {roll?.map((cube, index) => (
                                  <Cube
                                    isDisabled
                                    key={index}
                                    value={cube}
                                    isSelected={!!reroll?.[index]}
                                  />
                                ))}
                              </Hand>
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
