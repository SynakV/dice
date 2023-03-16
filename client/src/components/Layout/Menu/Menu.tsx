import React, { useState } from "react";
import { useFadeIn } from "@src/utils/hooks/useFadeIn";
import { playAudio } from "@src/utils/helpers/audio.helper";
import { Rules } from "@src/components/Layout/Menu/Rules/Rules";
import { Amulet } from "@src/components/Layout/Menu/Amulet/Amulet";

export const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isShow, fadeInClass } = useFadeIn(isOpen);

  const toggleMenuOpen = () => {
    playAudio("hover");
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="menu">
      <Amulet isOpen={isOpen} toggleMenuOpen={toggleMenuOpen} />
      {isShow && (
        <div className={`menu__overlay ${fadeInClass}`}>
          <span className={`menu__text`}>Some random text</span>
          <Rules />
        </div>
      )}
    </div>
  );
};
