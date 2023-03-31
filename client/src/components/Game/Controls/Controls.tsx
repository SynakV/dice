import React from "react";
import { MESSAGES } from "@utils/common/types";
import { usePortal } from "@utils/hooks/usePortal";
import { useDesk } from "@utils/contexts/DeskContext";
import { useGame } from "@utils/contexts/GameContext";
import { useSocket } from "@utils/contexts/WebsocketContext";
import { shuffleArray } from "@utils/helpers/randomizer.helper";
import { afterTriggerStageStart } from "@utils/helpers/gameplay/gameplay.helper";

export const Controls = () => {
  const socket = useSocket();
  const portal = usePortal();
  const { desk, setDesk } = useDesk();
  const { toggleHistoryOpen } = useGame();

  const handleGameStart = () => {
    if (desk.gameplay.players) {
      socket.emit(MESSAGES.GAME_START, {
        id: desk._id,
        sequence: shuffleArray(desk.gameplay.players),
      });
    }
  };

  const handleRollDice = () => {
    setDesk(afterTriggerStageStart);
  };

  const rounds = desk.gameplay.rounds;
  const currentRound = rounds[desk.gameplay.status.round];
  const currentStage = currentRound.stages[desk.gameplay.status.stage];
  const isAllPlayersPresent =
    desk.gameplay.players.length === desk.gameplay.max.players;

  const isNotStarted = !currentStage.isStarted;
  const isFirstStageNotCompleted = !currentRound.stages[0].isCompleted;

  return portal(
    <div className="controls">
      <span
        className={`controls__start ${
          isAllPlayersPresent ? "" : "controls__start--disabled"
        }`}
        onClick={isAllPlayersPresent ? () => handleGameStart() : () => {}}
      >
        Start game
      </span>
      <span
        onClick={isNotStarted ? () => handleRollDice() : () => {}}
        className={`controls__roll ${
          isNotStarted ? "" : "controls__roll--disabled"
        }`}
      >
        {isFirstStageNotCompleted ? "Roll" : "Re-roll"} dice
      </span>
      <span className="controls__history" onClick={toggleHistoryOpen}>
        History
      </span>
    </div>
  );
};
