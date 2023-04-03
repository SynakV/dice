import React from "react";
import { MESSAGES } from "@utils/common/types";
import { usePortal } from "@utils/hooks/usePortal";
import { useDesk } from "@utils/contexts/DeskContext";
import { useSocket } from "@utils/contexts/WebsocketContext";
import { shuffleArray } from "@utils/helpers/randomizer.helper";
import { GAME_OPEN, useGame } from "@utils/contexts/GameContext";
import {
  afterStartGame,
  afterTriggerStageStart,
} from "@utils/helpers/gameplay/gameplay.helper";

export const Controls = () => {
  // const socket = useSocket();
  const portal = usePortal();
  const { desk, setDesk } = useDesk();
  const { toggleGameOpen } = useGame();

  const handleGameStart = () => {
    setDesk(afterStartGame);
    // if (desk.gameplay.players) {
    //   socket.emit(MESSAGES.GAME_START, {
    //     id: desk._id,
    //     sequence: shuffleArray(desk.gameplay.players),
    //   });
    // }
  };

  const handleRollDice = () => {
    setDesk(afterTriggerStageStart);
  };

  const rounds = desk.gameplay.rounds;
  const currentRound = rounds[desk.gameplay.current.round];
  const currentStage = currentRound.stages[desk.gameplay.current.stage];
  const isAllPlayersPresent =
    desk.gameplay.players.length === desk.gameplay.max.players;

  const isCurrentStageNotStarted = !currentStage.isStarted;
  const isFirstStageNotCompleted = !currentRound.stages[0].isCompleted;

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
          onClick={isCurrentStageNotStarted ? () => handleRollDice() : () => {}}
          className={`controls__roll ${
            isCurrentStageNotStarted ? "" : "controls__roll--disabled"
          }`}
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
