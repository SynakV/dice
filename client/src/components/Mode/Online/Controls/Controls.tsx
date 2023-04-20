import React from "react";
import { usePortal } from "@utils/hooks/usePortal";
import { useDesk } from "@utils/contexts/DeskContext";
import { GAME_OPEN, useGame } from "@utils/contexts/GameContext";
import {
  isPass,
  getCurrentRanking,
} from "@utils/helpers/gameplay/cubes.helper";

export const Controls = () => {
  const portal = usePortal();
  const { handle, desk } = useDesk();
  const { player, isControlsLoading, toggleGameOpen, setIsControlsLoading } =
    useGame();

  const handleStartGame = () => {
    handle.startGame();
    setIsControlsLoading(true);
  };

  const handleRollDice = () => {
    if (isPassing && desk.gameplay.current.stage !== 0) {
      handle.passThrowDice();
    } else {
      handle.startThrowDice();
    }
    setIsControlsLoading(true);
  };

  const ranking = getCurrentRanking(desk, player);
  const isPassing = isPass(ranking?.cubes.reroll);

  const rounds = desk.gameplay.rounds;
  const currentRound = rounds[desk.gameplay.current.round];
  const currentStage = currentRound.stages[desk.gameplay.current.stage];
  const isAllPlayersPresent =
    desk.gameplay.players.length === desk.gameplay.max.players;

  const isCurrentPlayerThrew = currentStage.isPlayerThrew;
  const isCurrentStageNotStarted = !currentStage.isStarted;
  const isFirstStageNotCompleted = !currentRound.stages[0].isCompleted;
  const isCurrentPlayer = desk.gameplay.current.player?.id === player?.id;

  const isYouFirstPlayer = desk.gameplay.players[0]?.id === player?.id;

  const isAllowedToRoll =
    isCurrentStageNotStarted && !isCurrentPlayerThrew && isCurrentPlayer;

  const isAllowToStartGame =
    !isControlsLoading && isAllPlayersPresent && isYouFirstPlayer;

  return portal(
    <div className="controls">
      {!desk.gameplay.isGameStarted && isAllowToStartGame ? (
        <span
          className={`controls__start ${
            isAllowToStartGame ? "" : "controls__start--disabled"
          } ${isControlsLoading ? "controls__start--loading" : ""}`}
          onClick={isAllowToStartGame ? () => handleStartGame() : () => {}}
        >
          Start game
        </span>
      ) : (
        <span
          onClick={
            !isControlsLoading && isAllowedToRoll
              ? () => handleRollDice()
              : () => {}
          }
          className={`controls__roll ${
            isAllowedToRoll ? "" : "controls__roll--disabled"
          } ${isControlsLoading ? "controls__start--loading" : ""}`}
        >
          {isFirstStageNotCompleted
            ? "Roll dice"
            : isPassing
            ? "Pass"
            : "Re-roll dice"}
        </span>
      )}
      <span
        className="controls__history"
        onClick={() => toggleGameOpen(GAME_OPEN.HISTORY)}
      >
        History
      </span>
      {isYouFirstPlayer && (
        <span
          className="controls__settings"
          onClick={() => toggleGameOpen(GAME_OPEN.SETTINGS)}
        >
          Settings
        </span>
      )}
    </div>
  );
};
