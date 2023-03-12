import React, { useState } from "react";
import { OPPONENT } from "@src/utils/types";
import { Desk } from "@components/Main/Desk/Desk";
import { OpponentSelector } from "@components/Main/OpponentSelector/OpponentSelector";

export const Main = () => {
  const [selectedOpponent, setSelectedOpponent] = useState<OPPONENT | null>(
    null
  );

  return (
    <div className="main">
      {selectedOpponent ? (
        <OpponentSelector setSelectedOpponent={setSelectedOpponent} />
      ) : (
        <Desk />
      )}
    </div>
  );
};
