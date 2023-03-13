import React, { FC } from "react";
import { OPPONENT } from "@src/utils/types";

interface Props {
  setSelectedOpponent: (selectedOpponent: OPPONENT | null) => void;
}

export const Selector: FC<Props> = ({ setSelectedOpponent }) => {
  return (
    <div className="selector">
      <span className="selector__head-text">Select opponent</span>
      <div className="selector__selector">
        {Object.entries(OPPONENT).map(([_, value]) => (
          <span
            key={value}
            className="selector__option"
            onClick={setSelectedOpponent.bind(this, value)}
          >
            {value}
          </span>
        ))}
      </div>
    </div>
  );
};
