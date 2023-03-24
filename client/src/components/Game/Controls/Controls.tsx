import React from "react";
import { MESSAGES } from "@src/utils/common/types";
import { useDesk } from "@src/utils/contexts/DeskContext";
import { useSocket } from "@src/utils/contexts/WebsocketContext";
import { shuffleArray } from "@src/utils/helpers/randomizer.helper";

export const Controls = () => {
  const { desk } = useDesk();
  const socket = useSocket();

  const handleGameStart = () => {
    if (desk?.players?.players) {
      socket.emit(MESSAGES.GAME_START, {
        id: desk._id,
        sequence: shuffleArray(desk.players.players),
      });
    }
  };

  const isAllPlayersPresent =
    desk?.players?.players?.length === desk?.players?.max;

  return (
    <span
      className={`controls__start ${
        isAllPlayersPresent ? "" : "controls__start--disabled"
      }`}
      onClick={isAllPlayersPresent ? () => handleGameStart() : () => {}}
    >
      Start game
    </span>
  );
};
