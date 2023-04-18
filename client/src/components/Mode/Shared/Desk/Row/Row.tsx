import React, { FC, ReactNode } from "react";

interface Props {
  player: string;
  ranking?: string;
  children: ReactNode;
}

export const Row: FC<Props> = ({ player, ranking, children }) => {
  return (
    <div className="row">
      <div className="row__header">
        <span className="row__player">{player}</span>
        <span className="row__value">{ranking}</span>
      </div>
      <div className="row__cubes">{children}</div>
    </div>
  );
};
