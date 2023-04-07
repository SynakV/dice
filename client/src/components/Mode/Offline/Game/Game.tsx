import React, { FC } from "react";
import { useGame } from "@utils/contexts/GameContext";
import { Desk } from "@components/Mode/Offline/Game/Desk/Desk";
import { Status } from "@components/Mode/Shared/Status/Status";
import { Settings } from "@components/Shared/Settings/Settings";
import { History } from "@components/Mode/Shared/History/History";
import { Controls } from "@components/Mode/Offline/Game/Controls/Controls";
import { Conclusion } from "@components/Mode/Offline/Game/Conclusion/Conclusion";

export const Game: FC = () => {
  const { isInitSettings } = useGame();

  return (
    <div className="game">
      {!isInitSettings && (
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
