import Image from "next/image";
import { FC, MouseEventHandler } from "react";

interface Button {
  text: string;
  isDiabled?: boolean;
  isLoading?: boolean;
  position: "left" | "center" | "right";
  onClick: MouseEventHandler<HTMLDivElement>;
}

export const Button: FC<Button> = ({
  text,
  position,
  isDiabled,
  isLoading,
  onClick,
  ...rest
}) => (
  <div
    className={`controls__button ${
      position ? `controls__button--${position}` : ""
    } ${isDiabled ? "controls__button--disabled" : ""} ${
      isLoading ? "controls__button--loading" : ""
    }`}
    onClick={!isDiabled && !isLoading ? onClick : () => {}}
    {...rest}
  >
    {position !== "center" && (
      <Image
        width={85}
        height={85}
        alt="corner"
        src="/images/grunge-corner.png"
      />
    )}
    {text}
  </div>
);
