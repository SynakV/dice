import Image from "next/image";
import React, { useState } from "react";
import { useFadeIn } from "@utils/hooks/useFadeIn";
import { CredentialsType, PlayerType } from "@utils/common/types";
import { Rules } from "@components/Shared/Layout/Menu/Rules/Rules";
import { Amulet } from "@components/Shared/Layout/Menu/Amulet/Amulet";
import {
  getCredentials,
  setCredentials,
} from "@utils/helpers/storage/storage.helper";
import { playSound } from "@utils/contexts/MediaProvider";
import { useCursor } from "@utils/contexts/CursorProvider";
import { Media } from "@components/Shared/Layout/Menu/Media/Media";
import { Credentials } from "@components/Shared/Credentials/Credentials";

export const Menu = () => {
  const [isOpen, setIsOpen] = useState({
    menu: false,
    media: false,
    credentials: false,
  });
  const Cursor = useCursor();
  const { isShow, fadeInClass } = useFadeIn(isOpen.menu);

  const player: PlayerType = getCredentials();

  const toggleOpen = (key: "menu" | "media" | "credentials") => {
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
          <Cursor id="menu-media" hint="Audio">
            <Image
              priority
              width={40}
              height={40}
              alt="media"
              className="menu__media"
              src="/images/grunge-music.png"
              onClick={() => toggleOpen("media")}
            />
          </Cursor>
          <Rules />
          <Media
            isOpen={isOpen.media}
            toggleIsOpen={() => toggleOpen("media")}
          />
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
