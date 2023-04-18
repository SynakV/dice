import React, { useEffect, useState } from "react";
import { Navigator } from "@components/Shared/Navigator/Navigator";
import { GAME_OPEN, useGame } from "@utils/contexts/GameContext";
import { Settings } from "@components/Shared/Settings/Settings";
import { Credentials } from "@components/Shared/Credentials/Credentials";
import { CredentialsType } from "@components/Shared/Credentials/utils/types";
import {
  getStorageObjectItem,
  setStorageItem,
} from "@utils/helpers/storage/storage.helper";
import { STORAGE_ITEMS } from "@utils/helpers/storage/constants";
import { useRouter } from "next/router";
import { Desk } from "../Shared/Desk/Desk";
import { Status } from "../Shared/Status/Status";
import { History } from "../Shared/History/History";
import { Controls } from "./Controls/Controls";
import { Conclusion } from "./Conclusion/Conclusion";
import { Cubes } from "./Cubes/Cubes";

export const Offline = () => {
  const { replace } = useRouter();
  const { isInitSettings, toggleGameOpen } = useGame();
  const [isOpen, setIsOpen] = useState(false);

  const credentials = getStorageObjectItem(STORAGE_ITEMS.CREDENTIALS);

  useEffect(() => {
    if (!credentials.name) {
      setIsOpen(true);
    } else {
      toggleGameOpen(GAME_OPEN.SETTINGS);
    }
  }, []);

  const handleSetCredentials = (credentials: CredentialsType) => {
    setIsOpen(false);
    toggleGameOpen(GAME_OPEN.SETTINGS);
    setStorageItem(STORAGE_ITEMS.CREDENTIALS, JSON.stringify(credentials));
  };

  const handleCloseCredentials = () => {
    replace("/");
  };

  return (
    <>
      <Settings />
      <Navigator text="Home" />
      {!isInitSettings && (
        <>
          <Status />
          <History />
          <Controls />
          <Conclusion />
          <Desk cubes={Cubes} />
        </>
      )}
      <Credentials
        isOpen={isOpen}
        setCredentials={handleSetCredentials}
        toggleIsOpen={handleCloseCredentials}
      />
    </>
  );
};
