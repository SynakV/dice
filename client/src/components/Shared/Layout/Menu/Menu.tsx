import React, { useState } from "react";
import { useFadeIn } from "@utils/hooks/useFadeIn";
import { useGame } from "@utils/contexts/GameContext";
import { playAudio } from "@utils/helpers/audio.helper";
import { CredentialsType, PlayerType } from "@utils/common/types";
import { Rules } from "@components/Shared/Layout/Menu/Rules/Rules";
import { Amulet } from "@components/Shared/Layout/Menu/Amulet/Amulet";
import { setCredentials } from "@utils/helpers/storage/storage.helper";
import { Credentials } from "@components/Shared/Credentials/Credentials";

export const Menu = () => {
  const [isOpen, setIsOpen] = useState({
    menu: false,
    credentials: false,
  });
  const { player, setPlayer } = useGame();
  const { isShow, fadeInClass } = useFadeIn(isOpen.menu);

  const toggleOpen = (key: "menu" | "credentials") => {
    playAudio("hover");
    setIsOpen((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSetCredentials = (credentials: CredentialsType) => {
    toggleOpen("credentials");
    setPlayer(credentials as PlayerType);
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
            isOpen={isOpen.credentials}
            setCredentials={handleSetCredentials}
            toggleIsOpen={() => toggleOpen("credentials")}
          />
        </div>
      )}
    </div>
  );
};
