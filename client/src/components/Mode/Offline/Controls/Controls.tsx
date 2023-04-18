import React from "react";
import { usePortal } from "@utils/hooks/usePortal";
import { useDesk } from "@utils/contexts/DeskContext";
import { GAME_OPEN, useGame } from "@utils/contexts/GameContext";
import { STORAGE_ITEMS } from "@utils/helpers/storage/constants";
import { getStorageObjectItem } from "@utils/helpers/storage/storage.helper";
import {
  isPass,
  getCurrentRanking,
} from "@utils/helpers/gameplay/cubes.helper";

export const Controls = () => {
  const portal = usePortal();
  const { handle, desk } = useDesk();
  const { toggleGameOpen } = useGame();

  const handleGameStart = () => {
    handle.startGame();
  };

  const handleRollDice = () => {
    if (isPassing && desk.gameplay.current.stage !== 0) {
      handle.passThrowDice();
    } else {
      handle.startThrowDice();
    }
  };

  const player = getStorageObjectItem(STORAGE_ITEMS.CREDENTIALS);
  const ranking = getCurrentRanking(desk, player);
  const isPassing = isPass(ranking?.cubes.reroll);

  const rounds = desk.gameplay.rounds;
  const currentRound = rounds[desk.gameplay.current.round];
  const currentStage = currentRound.stages[desk.gameplay.current.stage];
  const isAllPlayersPresent =
    desk.gameplay.players.length === desk.gameplay.max.players;

  const isCurrentStageNotStarted = !currentStage.isStarted;
  const isCurrentPlayerThrew = currentStage.isPlayerThrew;
  const isFirstStageNotCompleted = !currentRound.stages[0].isCompleted;

  const isAllowedToRoll = isCurrentStageNotStarted && !isCurrentPlayerThrew;

  return portal(
    <div className="controls">
      {!desk.gameplay.isGameStarted ? (
        <span
          className={`controls__start ${
            isAllPlayersPresent ? "" : "controls__start--disabled"
          }`}
          onClick={isAllPlayersPresent ? () => handleGameStart() : () => {}}
        >
          Start game
        </span>
      ) : (
        <span
          onClick={isAllowedToRoll ? () => handleRollDice() : () => {}}
          className={`controls__roll ${
            isAllowedToRoll ? "" : "controls__roll--disabled"
          }`}
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
      <span
        className="controls__settings"
        onClick={() => toggleGameOpen(GAME_OPEN.SETTINGS)}
      >
        Settings
      </span>
    </div>
  );
};
