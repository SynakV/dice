import React, { useState } from "react";
import { useFadeIn } from "@utils/hooks/useFadeIn";
import { CredentialsType, PlayerType } from "@utils/common/types";
import { playAudio } from "@utils/helpers/audio.helper";
import { Rules } from "@components/Shared/Layout/Menu/Rules/Rules";
import { Amulet } from "@components/Shared/Layout/Menu/Amulet/Amulet";
import {
  getCredentials,
  setCredentials,
} from "@utils/helpers/storage/storage.helper";
import { Credentials } from "@components/Shared/Credentials/Credentials";

export const Menu = () => {
  const [isOpen, setIsOpen] = useState({
    menu: false,
    credentials: false,
  });
  const { isShow, fadeInClass } = useFadeIn(isOpen.menu);

  const player: PlayerType = getCredentials();

  const toggleOpen = (key: "menu" | "credentials") => {
    playAudio("hover");
    setIsOpen((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSetCredentials = (credentials: CredentialsType) => {
    toggleOpen("credentials");
    setCredentials(JSON.stringify(credentials));
  };

  return (
    <div className="menu">
      <Amulet toggleOpen={() => toggleOpen("menu")} />
      {isShow && (
        <div className={`menu__overlay ${fadeInClass}`}>
          <span
            className={`menu__text`}
            onClick={() => toggleOpen("credentials")}
          >
            {player?.name}
          </span>
          <Rules />
          <Credentials
            credentials={player}
            isOpen={isOpen.credentials}
            setCredentials={handleSetCredentials}
            toggleIsOpen={() => toggleOpen("credentials")}
          />
        </div>
      )}
    </div>
  );
};
