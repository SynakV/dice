import React, { FC, useState } from "react";
import { Controls } from "./Controls/Controls";
import { GameplayType } from "@utils/common/types";
import { Desk } from "@src/components/Game/Desk/Desk";
import { History } from "@components/Game/History/History";
import { Conclusion } from "@components/Game/Conclusion/Conclusion";

interface Props {}

export const Game: FC<Props> = ({}) => {
  const [gameplay, setGamaplay] = useState<GameplayType>({});

  return (
    <div className="game">
      <Controls />
      <History history={gameplay.history} />
      <Desk gameplay={gameplay} setGameplay={setGamaplay} />
      <Conclusion gameplay={gameplay} setGameplay={setGamaplay} />
    </div>
  );
};
