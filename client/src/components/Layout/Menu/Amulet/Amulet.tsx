import React, { FC } from "react";
import { Music } from "@components/Layout/Menu/Amulet/Music/Music";

interface Props {
  isOpen: boolean;
  toggleMenuOpen: () => void;
}

export const Amulet: FC<Props> = ({ isOpen, toggleMenuOpen }) => {
  return (
    <div className="amulet" onClick={toggleMenuOpen}>
      <Music />
      <div className="amulet__text">
        <span className={`${isOpen ? "opening" : "closing"}`}>
          Some random text
        </span>
      </div>
    </div>
  );
};
