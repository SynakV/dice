import React, { useState } from "react";
import { useFadeIn } from "@src/utils/hooks/useFadeIn";
import { playAudio } from "@src/utils/helpers/audio.helper";
import { Rules } from "@src/components/Layout/Menu/Rules/Rules";
import { Amulet } from "@src/components/Layout/Menu/Amulet/Amulet";
import { STORAGE_ITEMS } from "@src/utils/helpers/storage/constants";
import { Credentials } from "@src/components/Selector/Credentials/Credentials";
import {
  getStorageObjectItem,
  setStorageItem,
} from "@src/utils/helpers/storage/storage.helper";
import { CredentialsType } from "@src/components/Selector/Credentials/utils/types";

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
