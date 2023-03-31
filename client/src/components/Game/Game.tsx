import React, { FC } from "react";
import { Desk } from "@components/Game/Desk/Desk";
import { Status } from "@components/Game/Status/Status";
import { History } from "@components/Game/History/History";
import { Controls } from "@components/Game/Controls/Controls";
import { Conclusion } from "@components/Game/Conclusion/Conclusion";

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
