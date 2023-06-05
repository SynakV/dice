import React, { useState } from "react";
import { useFadeIn } from "@utils/hooks/useFadeIn";
import { CredentialsType, PlayerType } from "@utils/common/types";
import { Rules } from "@components/Shared/Layout/Menu/Rules/Rules";
import { Amulet } from "@components/Shared/Layout/Menu/Amulet/Amulet";
import {
  getCredentials,
  setCredentials,
} from "@utils/helpers/storage/storage.helper";
import { useCursor } from "@utils/contexts/CursorProvider";
import { playSound, useMedia } from "@utils/contexts/MediaProvider";
import { Credentials } from "@components/Shared/Credentials/Credentials";

export const Menu = () => {
  const [isOpen, setIsOpen] = useState({
    menu: false,
    credentials: false,
  });
  const Cursor = useCursor();
  const { volume, setVolume } = useMedia();
  const { isShow, fadeInClass } = useFadeIn(isOpen.menu);

  const player: PlayerType = getCredentials();

  const toggleOpen = (key: "menu" | "credentials") => {
    playSound("hover");
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
          <Cursor id="change-name" hint="Change name" position="bottom">
            <span
              className={`menu__text`}
              onClick={() => toggleOpen("credentials")}
            >
              {player?.name}
            </span>
          </Cursor>
          {/* <div className="menu__volume">
            <input
              min={0}
              max={1}
              step={0.1}
              type="range"
              value={volume}
              onChange={(e) => setVolume(e.target.valueAsNumber)}
            />
          </div> */}
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
