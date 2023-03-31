import React, { useState } from "react";
import { useFadeIn } from "@utils/hooks/useFadeIn";
import { playAudio } from "@utils/helpers/audio.helper";
import { STORAGE_ITEMS } from "@utils/helpers/storage/constants";
import { Rules } from "@components/Shared/Layout/Menu/Rules/Rules";
import { Amulet } from "@components/Shared/Layout/Menu/Amulet/Amulet";
import { Credentials } from "@components/Shared/Credentials/Credentials";
import {
  setStorageItem,
  getStorageObjectItem,
} from "@utils/helpers/storage/storage.helper";
import { CredentialsType } from "@components/Shared/Credentials/utils/types";

export const Menu = () => {
  const [isOpen, setIsOpen] = useState({
    menu: false,
    credentials: false,
  });
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
    setStorageItem(STORAGE_ITEMS.CREDENTIALS, JSON.stringify(credentials));
  };

  const name = getStorageObjectItem(STORAGE_ITEMS.CREDENTIALS)?.name;

  return (
    <div className="menu">
      <Amulet toggleOpen={() => toggleOpen("menu")} />
      {isShow && (
        <div className={`menu__overlay ${fadeInClass}`}>
          <span
            className={`menu__text`}
            onClick={() => toggleOpen("credentials")}
          >
            {name}
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
