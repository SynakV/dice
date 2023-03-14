import React, { useState } from "react";
import { useFadeIn } from "@src/utils/hooks/useFadeIn";
import { Rules } from "@src/components/Layout/Menu/Rules/Rules";
import { Amulet } from "@src/components/Layout/Menu/Amulet/Amulet";

export const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isShow, fadeInClass } = useFadeIn(isOpen);

  const toggleMenuOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="menu">
      <Amulet isOpen={isOpen} toggleMenuOpen={toggleMenuOpen} />
      {isShow && (
        <div className={`menu__overlay ${fadeInClass}`}>
          <Rules />
        </div>
      )}
    </div>
  );
};
