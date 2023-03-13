import React, { useState } from "react";
import { OPPONENT } from "@src/utils/types";
import { Game } from "@components/Main/Game/Game";
import { Selector } from "@components/Main/Selector/Selector";

export const Main = () => {
  const [selectedOpponent, setSelectedOpponent] = useState<OPPONENT | null>(
    null
  );

  return (
    <div className="main">
      {selectedOpponent ? (
        <Selector setSelectedOpponent={setSelectedOpponent} />
      ) : (
        <Game />
      )}
    </div>
  );
};
