import React, { FC } from "react";
import { OPPONENT } from "@src/utils/types";

interface Props {
  setSelectedOpponent: (selectedOpponent: OPPONENT | null) => void;
}

export const OpponentSelector: FC<Props> = ({ setSelectedOpponent }) => {
  return (
    <div className="opponent-selector">
      <span className="opponent-selector__head-text">Select opponent</span>
      <div className="opponent-selector__selector">
        {Object.entries(OPPONENT).map(([_, value]) => (
          <span
            key={value}
            className="opponent-selector__select-option"
            onClick={setSelectedOpponent.bind(this, value)}
          >
            {value}
          </span>
        ))}
      </div>
    </div>
  );
};
