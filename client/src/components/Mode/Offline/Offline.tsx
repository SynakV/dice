import React, { useEffect, useState } from "react";
import { Settings } from "@components/Shared/Settings/Settings";
import { GAME_OPEN, useGame } from "@utils/contexts/GameContext";
import { Navigator } from "@components/Shared/Navigator/Navigator";
import { Credentials } from "@components/Shared/Credentials/Credentials";
import {
  getCredentials,
  setCredentials,
} from "@utils/helpers/storage/storage.helper";
import { useRouter } from "next/router";
import { useDesk } from "@utils/contexts/DeskContext";
import { Desk } from "@components/Mode/Shared/Desk/Desk";
import { FadeIn } from "@components/Shared/FadeIn/FadeIn";
import { Cubes } from "@components/Mode/Offline/Cubes/Cubes";
import { Confirm } from "@components/Shared/Confirm/Confirm";
import { Status } from "@components/Mode/Shared/Status/Status";
import { History } from "@components/Mode/Shared/History/History";
import { CredentialsType, PlayerType } from "@utils/common/types";
import { Controls } from "@components/Mode/Offline/Controls/Controls";
import { Conclusion } from "@components/Mode/Offline/Conclusion/Conclusion";
import {
  useMedia,
  MUSIC_NAME,
  VIDEO_NAME,
  DEFAULT_FADE_TIME,
} from "@utils/contexts/MediaProvider";

export const Offline = () => {
  const { desk } = useDesk();
  const { replace } = useRouter();
  const { playVideo, playMusic } = useMedia();
  const { player, setPlayer, isInitSettings, toggleGameOpen } = useGame();

  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    playVideo({
      name: VIDEO_NAME.PREFIGHT,
      appFadeDuration: DEFAULT_FADE_TIME,
    });
    playMusic({
      name: MUSIC_NAME.PREFIGHT,
      switchDuration: DEFAULT_FADE_TIME,
    });

    setPlayer(getCredentials());
  }, []);

  useEffect(() => {
    if (!player) {
      return;
    }

    if (!player.name) {
      setIsOpen(true);
    }

    if (player.name && !player.id) {
      toggleGameOpen(GAME_OPEN.SETTINGS);
    }
  }, [player]);

  const handleSetCredentials = (credentials: CredentialsType) => {
    setIsOpen(false);
    setPlayer(credentials as PlayerType);
    setCredentials(JSON.stringify(credentials));
  };

  const handleCloseCredentials = () => {
    replace("/");
  };

  const handleNavigate = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirm = (isConfirmed: boolean) => {
    if (isConfirmed) {
      replace("/");
    } else {
      setIsConfirmOpen(false);
    }
  };

  const isShowGameDesk = !isInitSettings && player?.id;

  return (
    <>
      <Settings />
      <Navigator
        onNavigate={
          desk.gameplay.isGameStarted ? () => handleNavigate() : undefined
        }
      />
      <Confirm
        ok="Yes"
        cancel="No"
        isOpen={isConfirmOpen}
        onConfirm={handleConfirm}
        title="Game will be lost. Do you want to exit?"
      />
      {isShowGameDesk && (
        <FadeIn>
          <Status />
          <History />
          <Controls />
          <Conclusion />
          <Desk cubes={Cubes} />
        </FadeIn>
      )}
      <Credentials
        isOpen={isOpen}
        credentials={player}
        setCredentials={handleSetCredentials}
        toggleIsOpen={handleCloseCredentials}
      />
    </>
  );
};
