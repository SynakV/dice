import React from "react";
import { usePortal } from "@utils/hooks/usePortal";
import { useDesk } from "@utils/contexts/DeskContext";
import { GAME_OPEN, useGame } from "@utils/contexts/GameContext";
import { STORAGE_ITEMS } from "@utils/helpers/storage/constants";
import { getStorageObjectItem } from "@utils/helpers/storage/storage.helper";

export const Controls = () => {
  const portal = usePortal();
  const { handle, desk } = useDesk();
  const { isControlsLoading, toggleGameOpen, setIsControlsLoading } = useGame();

  const handleStartGame = () => {
    handle.startGame();
    setIsControlsLoading(true);
  };

  const handleRollDice = () => {
    handle.startStage();
    setIsControlsLoading(true);
  };

  const rounds = desk.gameplay.rounds;
  const currentRound = rounds[desk.gameplay.current.round];
  const currentStage = currentRound.stages[desk.gameplay.current.stage];
  const isAllPlayersPresent =
    desk.gameplay.players.length === desk.gameplay.max.players;

  const isCurrentStageNotStarted = !currentStage.isStarted;
  const isCurrentPlayerThrew = currentStage.isPlayerThrew;
  const isCurrentPlayer =
    desk.gameplay.current.player?.name ===
    getStorageObjectItem(STORAGE_ITEMS.CREDENTIALS).name;
  const isFirstStageNotCompleted = !currentRound.stages[0].isCompleted;

  const isAllowedToRoll =
    isCurrentStageNotStarted && !isCurrentPlayerThrew && isCurrentPlayer;

  return portal(
    <div className="controls">
      {!desk.gameplay.isGameStarted ? (
        <span
          className={`controls__start ${
            isAllPlayersPresent ? "" : "controls__start--disabled"
          } ${isControlsLoading ? "controls__start--loading" : ""}`}
          onClick={
            !isControlsLoading && isAllPlayersPresent
              ? () => handleStartGame()
              : () => {}
          }
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
          {isFirstStageNotCompleted ? "Roll" : "Re-roll"} dice
        </span>
      )}
      <span
        className="controls__history"
        onClick={() => toggleGameOpen(GAME_OPEN.HISTORY)}
      >
        History
      </span>
      <span
        className="controls__settings"
        onClick={() => toggleGameOpen(GAME_OPEN.SETTINGS)}
      >
        Settings
      </span>
    </div>
  );
};
