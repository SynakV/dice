import React, { FC, ReactNode } from "react";

interface Props {
  player: string;
  ranking?: string;
  children: ReactNode;
}

export const Hand: FC<Props> = ({ player, ranking, children }) => {
  return (
    <div className="hand">
      <div className="hand__header">
        <span className="hand__player">{player}</span>
        <span className="hand__value">{ranking}</span>
      </div>
      <div className="hand__cubes">{children}</div>
    </div>
  );
};
