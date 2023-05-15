import React, { FC } from "react";
import { useCursor } from "@utils/contexts/CursorProvider";
import { Music } from "@components/Shared/Layout/Menu/Amulet/Music/Music";

interface Props {
  toggleOpen: () => void;
}

export const Amulet: FC<Props> = ({ toggleOpen }) => {
  const Cursor = useCursor();

  return (
    <Cursor id="menu" hint="Menu" position="bottom-left">
      <div className="amulet" onClick={toggleOpen}>
        <Music />
      </div>
    </Cursor>
  );
};
