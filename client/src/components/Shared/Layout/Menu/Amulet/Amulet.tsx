import React, { FC } from "react";
import { Music } from "@src/components/Shared/Layout/Menu/Amulet/Music/Music";

interface Props {
  toggleOpen: () => void;
}

export const Amulet: FC<Props> = ({ toggleOpen }) => {
  return (
    <div className="amulet" onClick={toggleOpen}>
      <Music />
    </div>
  );
};
