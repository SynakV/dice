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
    <div className="cube-wrapper">
      <div
        onClick={isOtherPlayer ? () => {} : () => selectDie()}
        className={`cube cube-${value}`}
      >
        <div className="front">
          <span className="dot dot1"></span>
        </div>
        <div className="back">
          <span className="dot dot1"></span>
          <span className="dot dot2"></span>
        </div>
        <div className="right">
          <span className="dot dot1"></span>
          <span className="dot dot2"></span>
          <span className="dot dot3"></span>
        </div>
        <div className="left">
          <span className="dot dot1"></span>
          <span className="dot dot2"></span>
          <span className="dot dot3"></span>
          <span className="dot dot4"></span>
        </div>
        <div className="top">
          <span className="dot dot1"></span>
          <span className="dot dot2"></span>
          <span className="dot dot3"></span>
          <span className="dot dot4"></span>
          <span className="dot dot5"></span>
        </div>
        <div className="bottom">
          <span className="dot dot1"></span>
          <span className="dot dot2"></span>
          <span className="dot dot3"></span>
          <span className="dot dot4"></span>
          <span className="dot dot5"></span>
          <span className="dot dot6"></span>
        </div>
      </div>
      <span
        className={`cube-status cube-status__${
          isSelected ? "selected" : "ignored"
        }`}
      />
    </div>
  );
};
