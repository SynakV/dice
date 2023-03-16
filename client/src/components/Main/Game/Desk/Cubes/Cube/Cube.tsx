import React, { FC } from "react";

interface Props {
  value: number;
  isSelected: boolean;
  isOtherUser: boolean;
  setDieForReRoll: (value: number) => void;
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
      onClick={isOtherUser ? () => {} : () => setDieForReRoll(value)}
    >
      {value}
    </div>
  );
};
