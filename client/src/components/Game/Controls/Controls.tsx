import React from "react";
import { usePortal } from "@src/utils/hooks/usePortal";
import { useDesk } from "@src/utils/contexts/DeskContext";
import { useGame } from "@src/utils/contexts/GameContext";
import { MESSAGES, ROUND_STAGE } from "@src/utils/common/types";
import { useSocket } from "@src/utils/contexts/WebsocketContext";
import { shuffleArray } from "@src/utils/helpers/randomizer.helper";
import { afterTriggerStageStart } from "@src/utils/helpers/gameplay/gameplay.helper";

export const Controls = () => {
  const socket = useSocket();
  const portal = usePortal();
  const { desk, setDesk } = useDesk();
  const { toggleHistoryOpen } = useGame();

  const handleGameStart = () => {
    if (desk?.players?.players) {
      socket.emit(MESSAGES.GAME_START, {
        id: desk._id,
        sequence: shuffleArray(desk.players.players),
      });
    }
  };

  const handleRollDice = () => {
    setDesk(afterTriggerStageStart);
  };

  const isAllPlayersPresent =
    desk?.players?.players?.length === desk?.players?.max;

  const isNotStart = !desk?.gameplay?.round?.stage?.isStart;
  const isFirstStageNotCompleted =
    !desk?.gameplay?.round?.stage?.isCompleted?.[ROUND_STAGE.START];

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
        onClick={isNotStart ? () => handleRollDice() : () => {}}
        className={`controls__roll ${
          isNotStart ? "" : "controls__roll--disabled"
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
