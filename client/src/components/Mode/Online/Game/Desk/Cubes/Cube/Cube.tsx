import React, { FC } from "react";

interface Props {
  value: number;
  isSelected: boolean;
  selectDie: () => void;
  isOtherPlayer: boolean;
  isCurrentPlayerTurn: boolean;
}

export const Cube: FC<Props> = ({
  value,
  selectDie,
  isSelected,
  isOtherPlayer,
  isCurrentPlayerTurn,
}) => {
  return (
    <div
      className={`cube ${isSelected ? "selected" : ""}`}
      onClick={
        !isCurrentPlayerTurn || isOtherPlayer ? () => {} : () => selectDie()
      }
    >
      {value}
    </div>
  );
};
