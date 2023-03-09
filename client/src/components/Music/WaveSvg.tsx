import React, { FC } from "react";

interface Props {
  className: string;
}

export const WaveSvg: FC<Props> = ({ className }) => {
  return (
    <div className={className}>
      <svg id="radar-circle" viewBox="0 0 50 50">
        <circle
          r="0"
          cx="50%"
          cy="50%"
          stroke="black"
          fillOpacity="0"
          strokeWidth="2px"
          strokeOpacity="1"
        >
          <animate
            to="15"
            dur="3s"
            from="0"
            attributeName="r"
            repeatCount="indefinite"
          />
          <animate
            to="0"
            dur="3s"
            from="1"
            repeatCount="indefinite"
            attributeName="stroke-opacity"
          ></animate>
        </circle>

        <circle
          r="0"
          cx="50%"
          cy="50%"
          stroke="black"
          fillOpacity="0"
          strokeWidth="2px"
          strokeOpacity="1"
        >
          <animate
            to="15"
            dur="3s"
            from="0"
            begin="0.75s"
            attributeName="r"
            repeatCount="indefinite"
          />
          <animate
            to="0"
            dur="3s"
            from="1"
            begin="0.75s"
            repeatCount="indefinite"
            attributeName="stroke-opacity"
          ></animate>
        </circle>

        <circle
          r="0"
          cx="50%"
          cy="50%"
          stroke="black"
          fillOpacity="0"
          strokeWidth="2px"
          strokeOpacity="1"
        >
          <animate
            to="15"
            dur="3s"
            from="0"
            begin="1.5s"
            attributeName="r"
            repeatCount="indefinite"
          />
          <animate
            to="0"
            dur="3s"
            from="1"
            begin="1.5s"
            repeatCount="indefinite"
            attributeName="stroke-opacity"
          ></animate>
        </circle>

        <circle cx="50%" cy="50%" r="5" fill="#000" stroke="#000"></circle>
      </svg>
    </div>
  );
};
