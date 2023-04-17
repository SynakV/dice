import React, { FC } from "react";

interface Props {
  onClick?: Function;
  isSelected: boolean;
  isDisabled: boolean;
  value: number | null;
  wrapperClassName?: string;
}

export const Cube: FC<Props> = ({
  value,
  onClick,
  isSelected,
  isDisabled,
  wrapperClassName,
}) => {
  const cubeClick = isDisabled ? () => {} : () => onClick && onClick();
  const cubeWrapperClassName = wrapperClassName ? wrapperClassName : "";
  const cubeWrapperSelected = isSelected ? "cube-wrapper__selected" : "";
  const cubeStatus = isSelected ? "cube-status__selected" : "";

  return (
    <div
      className={`cube-wrapper ${cubeWrapperSelected} ${cubeWrapperClassName}`}
    >
      <div onClick={cubeClick} className={`cube cube-${value}`}>
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
      <span className={`cube-status ${cubeStatus}`} />
    </div>
  );
};
