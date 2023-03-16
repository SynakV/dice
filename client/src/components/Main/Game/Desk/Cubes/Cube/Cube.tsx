import React, { FC } from "react";

interface Props {
  value: number;
  isSelected: boolean;
  isOtherUser: boolean;
  setDieForReRoll: () => void;
}

export const Cube: FC<Props> = ({
  value,
  isSelected,
  isOtherUser,
  setDieForReRoll,
}) => {
  return (
    <div
      className={`cube ${isSelected ? "selected" : ""}`}
      onClick={isOtherUser ? () => {} : () => setDieForReRoll()}
    >
      {value}
    </div>
  );
};
