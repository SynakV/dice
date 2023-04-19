import React, { useEffect, useState } from "react";
import { Settings } from "@components/Shared/Settings/Settings";
import { GAME_OPEN, useGame } from "@utils/contexts/GameContext";
import { Navigator } from "@components/Shared/Navigator/Navigator";
import { Credentials } from "@components/Shared/Credentials/Credentials";
import { CredentialsType } from "@components/Shared/Credentials/utils/types";
import {
  getCredentials,
  setCredentials,
} from "@utils/helpers/storage/storage.helper";
import { useRouter } from "next/router";
import { Desk } from "@components/Mode/Shared/Desk/Desk";
import { Cubes } from "@components/Mode/Offline/Cubes/Cubes";
import { Status } from "@components/Mode/Shared/Status/Status";
import { History } from "@components/Mode/Shared/History/History";
import { Controls } from "@components/Mode/Offline/Controls/Controls";
import { Conclusion } from "@components/Mode/Offline/Conclusion/Conclusion";

export const Offline = () => {
  const { replace } = useRouter();
  const { isInitSettings, toggleGameOpen } = useGame();
  const [isOpen, setIsOpen] = useState(false);

  const credentials = getCredentials();

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
    setCredentials(JSON.stringify(credentials));
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
