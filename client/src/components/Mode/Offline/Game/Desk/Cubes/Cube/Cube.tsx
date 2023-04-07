import React, { FC } from "react";

interface Props {
  value: number;
  isSelected: boolean;
  selectDie: () => void;
  isOtherPlayer: boolean;
}

export const Cube: FC<Props> = ({
  value,
  selectDie,
  isSelected,
  isOtherPlayer,
}) => {
  return (
    <div
      className={`cube ${isSelected ? "selected" : ""}`}
      onClick={isOtherPlayer ? () => {} : () => selectDie()}
    >
      {value}
    </div>
  );
};
