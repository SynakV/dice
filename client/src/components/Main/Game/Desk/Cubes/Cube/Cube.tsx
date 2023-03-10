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
  const handleClick = () => {
    const audio = new Audio("/music/dog.mp3");
    audio.volume = 0.02;
    audio.play();

    setDieForReRoll(value);
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
