import Image from "next/image";
import React, { FC } from "react";
import type { CursorContextType } from "@utils/contexts/CursorProvider";

interface Props {
  index?: number;
  onClick?: Function;
  isDisabled: boolean;
  isSelected?: boolean;
  value: number | null;
  Cursor?: CursorContextType | null;
  rollAnimationNumber?: number | false;
}

export const Cube: FC<Props> = ({
  index,
  value,
  Cursor,
  onClick,
  isSelected,
  isDisabled,
  rollAnimationNumber,
}) => {
  const cubeStatus = isSelected ? "cube-status__selected" : "";
  const cubeWrapperSelected = isSelected ? "cube-wrapper__selected" : "";
  const cubeWrapperDisabled = isDisabled ? "cube-wrapper__disabled" : "";

  const cubeClick = isDisabled ? () => {} : () => onClick && onClick();

  const Component = (
    <div
      className={`cube-wrapper ${cubeWrapperDisabled} ${cubeWrapperSelected}`}
    >
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

  return Cursor ? (
    <Cursor
      position="bottom"
      id={`cube-${index}`}
      isDisable={isDisabled}
      hint={isSelected ? "Unselect" : "Select"}
    >
      {Component}
    </Cursor>
  ) : (
    Component
  );
};
