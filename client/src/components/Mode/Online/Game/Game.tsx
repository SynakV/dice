import React, { FC } from "react";
import { Desk } from "@components/Mode/Online/Game/Desk/Desk";
import { Status } from "@components/Mode/Shared/Status/Status";
import { Settings } from "@components/Shared/Settings/Settings";
import { History } from "@components/Mode/Shared/History/History";
import { Controls } from "@components/Mode/Online/Game/Controls/Controls";
import { Conclusion } from "@components/Mode/Online/Game/Conclusion/Conclusion";

export const Game: FC = () => {
  return (
    <div className="game">
      <Desk />
      <Status />
      <History />
      <Controls />
      <Settings />
      <Conclusion />
    </div>
  );
};
