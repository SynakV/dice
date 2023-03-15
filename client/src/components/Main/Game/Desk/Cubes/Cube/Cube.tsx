import React, { FC } from "react";
import { playAudio } from "@src/utils/helpers/audio.helper";

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
  const handleClick = () => {
    setDieForReRoll(value);
    playAudio("selectDieForReroll");
  };

  return (
    <div
      className={`cube ${isSelected ? "selected" : ""}`}
      onClick={isOtherUser ? () => {} : () => handleClick()}
    >
      {value}
    </div>
  );
};
