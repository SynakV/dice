import React, { FC } from "react";
import { Desk } from "@components/Game/Desk/Desk";
import { useGame } from "@utils/contexts/GameContext";
import { useDesk } from "@utils/contexts/DeskContext";
import { Status } from "@components/Game/Status/Status";
import { History } from "@components/Game/History/History";
import { Controls } from "@components/Game/Controls/Controls";
import { Settings } from "@components/Game/Settings/Settings";
import { Conclusion } from "@components/Game/Conclusion/Conclusion";

export const Game: FC = () => {
  const { socket } = useDesk();
  const { isInitSettings } = useGame();

  return (
    <div className="game">
      {(!isInitSettings || socket) && (
        <>
          <Desk />
          <Status />
          <History />
          <Controls />
          <Conclusion />
        </>
      )}
      <Settings />
    </div>
  );
};
