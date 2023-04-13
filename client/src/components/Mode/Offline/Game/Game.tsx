import React, { FC } from "react";
import { Desk } from "@components/Mode/Offline/Game/Desk/Desk";
import { Status } from "@components/Mode/Shared/Status/Status";
import { History } from "@components/Mode/Shared/History/History";
import { Controls } from "@components/Mode/Offline/Game/Controls/Controls";
import { Conclusion } from "@components/Mode/Offline/Game/Conclusion/Conclusion";

export const Game: FC = () => {
  return (
    <div className="game">
      <Desk />
      <Status />
      <History />
      <Controls />
      <Conclusion />
    </div>
  );
};
