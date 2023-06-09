import React, { FC, ReactNode } from "react";

interface Props {
  id?: string;
  player: string;
  ranking?: string;
  className?: string;
  children: ReactNode;
}

export const Hand: FC<Props> = ({
  id,
  player,
  ranking,
  children,
  className,
}) => (
  <div className={`hand ${className}`} {...(id && { id })}>
    <div className="hand__header">
      <span className="hand__player">{player}</span>
      <span className="hand__value">{ranking}</span>
    </div>
    <div className="hand__cubes">{children}</div>
  </div>
);
