import Image from "next/image";
import React, { FC } from "react";

interface Props {
  onClick?: Function;
  isDisabled: boolean;
  isSelected?: boolean;
  value: number | null;
  rollAnimationNumber?: number | false;
}

export const Cube: FC<Props> = ({
  value,
  onClick,
  isSelected,
  isDisabled,
  rollAnimationNumber,
}) => {
  const cubeStatus = isSelected ? "cube-status__selected" : "";
  const cubeWrapperSelected = isSelected ? "cube-wrapper__selected" : "";

  const cubeClick = isDisabled ? () => {} : () => onClick && onClick();

  return (
    <div className={`cube-wrapper ${cubeWrapperSelected}`}>
      <div
        onClick={cubeClick}
        className={`cube cube-${rollAnimationNumber || value} ${
          rollAnimationNumber ? `cube-roll` : ""
        }`}
      >
        <div className="front">
          <span className="dot dot__centered" />
        </div>
        <div className="back">
          <span className="dot dot1" />
          <span className="dot dot2" />
        </div>
        <div className="right">
          <span className="dot dot1" />
          <span className="dot dot__centered" />
          <span className="dot dot3" />
        </div>
        <div className="left">
          <span className="dot dot1" />
          <span className="dot dot2" />
          <span className="dot dot3" />
          <span className="dot dot4" />
        </div>
        <div className="top">
          <span className="dot dot1" />
          <span className="dot dot2" />
          <span className="dot dot3" />
          <span className="dot dot4" />
          <span className="dot dot__centered" />
        </div>
        <div className="bottom">
          <span className="dot dot1" />
          <span className="dot dot2" />
          <span className="dot dot3" />
          <span className="dot dot4" />
          <span className="dot dot5" />
          <span className="dot dot6" />
        </div>
      </div>
      <Image
        width={100}
        height={100}
        alt="grunge-square-filled"
        src="/images/grunge-square-filled.png"
        className={`cube-status ${cubeStatus}`}
      />
    </div>
  );
};
