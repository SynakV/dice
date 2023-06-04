import Image from "next/image";
import React, { FC } from "react";
import { useCursor } from "@utils/contexts/CursorProvider";

interface Props {
  toggleOpen: () => void;
}

export const Amulet: FC<Props> = ({ toggleOpen }) => {
  const Cursor = useCursor();

  return (
    <Cursor id="menu" hint="Menu" position="bottom-left">
      <Image
        priority
        width={100}
        height={55}
        alt="amulet"
        className="amulet"
        onClick={toggleOpen}
        src="/images/amulet.png"
      />
    </Cursor>
  );
};
