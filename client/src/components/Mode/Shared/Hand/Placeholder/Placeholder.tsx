import Image from "next/image";
import React, { FC } from "react";
import { Hand } from "@components/Mode/Shared/Hand/Hand";

interface Props {
  player: number;
}

export const Placeholder: FC<Props> = ({ player }) => (
  <div className="placeholder">
    <Hand player={`Player ${player}`}>
      {new Array(5).fill(null).map((_, index) => (
        <div key={index} className="placeholder__wrapper">
          <Image
            width={100}
            height={100}
            alt="grunge-square-filled"
            className="placeholder__cube"
            src="/images/grunge-square-filled.png"
          />
        </div>
      ))}
    </Hand>
  </div>
);
