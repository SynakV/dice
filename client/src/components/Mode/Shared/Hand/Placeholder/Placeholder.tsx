import React, { FC } from "react";
import { Hand } from "@components/Mode/Shared/Hand/Hand";

interface Props {
  player: number;
}

export const Placeholder: FC<Props> = ({ player }) => {
  return (
    <div className="placeholder">
      <Hand player={`Player ${player}`}>
        {new Array(5).fill(null).map((_, index) => (
          <div key={index} className="placeholder__wrapper">
            <div className="placeholder__cube"></div>
          </div>
        ))}
      </Hand>
    </div>
  );
};
