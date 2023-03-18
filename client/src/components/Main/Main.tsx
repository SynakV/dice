import React, { useState } from "react";
import { OPPONENT } from "@src/utils/types";
import { Game } from "@components/Main/Game/Game";
import { Desks } from "@components/Main/Desks/Desks";
import { Selector } from "@components/Main/Selector/Selector";

export const Main = () => {
  const [selectedOpponent, setSelectedOpponent] = useState<OPPONENT | null>(
    OPPONENT.ANOTHER_USER
  );

  return (
    <div className="main">
      {!selectedOpponent && (
        <Selector setSelectedOpponent={setSelectedOpponent} />
      )}
      {selectedOpponent === OPPONENT.COMPUTER && <Game />}
      {selectedOpponent === OPPONENT.ANOTHER_USER && <Desks />}
    </div>
  );
};
