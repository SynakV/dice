import React, { FC } from "react";

interface Props {
  value: number;
}

export const Cube: FC<Props> = ({ value }) => {
  const handleClick = () => {
    const audio = new Audio("/music/dog.mp3");
    audio.volume = 0.02;
    audio.play();
  };

  return (
    <div className="cube" onClick={handleClick}>
      {value || " "}
    </div>
  );
};
