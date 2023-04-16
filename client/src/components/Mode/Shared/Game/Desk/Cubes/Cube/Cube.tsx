import React, { FC } from "react";

interface Props {
  onClick?: Function;
  isSelected: boolean;
  isDisabled: boolean;
  value: number | null;
}

export const Cube: FC<Props> = ({ value, onClick, isSelected, isDisabled }) => {
  return (
    <div
      className={`cube-wrapper ${isSelected ? "cube-wrapper__selected" : ""}`}
    >
      <div
        onClick={isDisabled ? () => {} : () => onClick && onClick()}
        className={`cube cube-${value}`}
      >
        <div className="front">
          <span className="dot dot1" />
        </div>
        <div className="back">
          <span className="dot dot1" />
          <span className="dot dot2" />
        </div>
        <div className="right">
          <span className="dot dot1" />
          <span className="dot dot2" />
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
          <span className="dot dot5" />
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
      <span
        className={`cube-status ${isSelected ? "cube-status__selected" : ""}`}
      />
    </div>
  );
};
