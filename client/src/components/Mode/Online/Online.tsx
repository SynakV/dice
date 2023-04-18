import { useDesk } from "@utils/contexts/DeskContext";
import { MESSAGES, DeskType, EVENTS } from "@utils/common/types";
import { STORAGE_ITEMS } from "@utils/helpers/storage/constants";
import {
  setStorageItem,
  getStorageObjectItem,
} from "@utils/helpers/storage/storage.helper";
import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";
import { Loading } from "../../Shared/Loading/Loading";
import { playAudio } from "@utils/helpers/audio.helper";
import { GAME_OPEN, useGame } from "@utils/contexts/GameContext";
import { Players } from "@components/Mode/Shared/Players/Players";
import { Credentials } from "../../Shared/Credentials/Credentials";
import { Navigator } from "@components/Shared/Navigator/Navigator";
import { CredentialsType } from "../../Shared/Credentials/utils/types";
import { useNotification } from "../../Shared/Notification/Notification";
import { Desk } from "../Shared/Desk/Desk";
import { Status } from "../Shared/Status/Status";
import { History } from "../Shared/History/History";
import { Controls } from "./Controls/Controls";
import { Settings } from "@components/Shared/Settings/Settings";
import { Conclusion } from "./Conclusion/Conclusion";
import { Cubes } from "./Cubes/Cubes";

export const Online: FC = () => {
  const { push } = useRouter();
  const { notification } = useNotification();
  const { desk, socket, setDesk } = useDesk();
  const { toggleGameOpen, setIsControlsLoading } = useGame();

  const [isOpen, setIsOpen] = useState(false);

  const credentials: CredentialsType = getStorageObjectItem(
    STORAGE_ITEMS.CREDENTIALS
  );

  const handleSameNameNotification = (
    data: DeskType,
    credentials: CredentialsType
  ) => {
    const playersNames = data.gameplay.players.map((player) => player.name);

    if (playersNames?.includes(credentials.name || "")) {
      notification(`Name ${credentials.name} already present in the desk`);
      return true;
    }

    return false;
  };

  const handleSetCredentials = (credentials: CredentialsType) => {
    if (!desk) {
      return;
    }

    const isSameName = handleSameNameNotification(desk, credentials);

    if (isSameName) {
      return;
    }

    setIsOpen(false);
    handleInitializePlayer(credentials);
    setStorageItem(STORAGE_ITEMS.CREDENTIALS, JSON.stringify(credentials));
  };

  useEffect(() => {
    if (!desk) {
      return;
    }

    if (!credentials.name || handleSameNameNotification(desk, credentials)) {
      return setIsOpen(true);
    }

    handleInitializePlayer(credentials);
  }, []);

  useEffect(() => {
    if (!socket) {
      return;
    }

    [EVENTS.ON_JOIN_DESK, EVENTS.ON_LEAVE_DESK].forEach((event) => {
      socket.on(event, (desk: DeskType) => {
        setDesk(desk);
      });
    });

    socket.on(EVENTS.ON_START_GAME, (desk: DeskType) => {
      setDesk(desk);
      setIsControlsLoading(false);
    });

    socket.on(EVENTS.ON_START_THROW_DICE, (desk: DeskType) => {
      setDesk(desk);
      playAudio("handMixDice");
      setIsControlsLoading(false);
    });

    socket.on(EVENTS.ON_THROW_DICE, (desk: DeskType) => {
      setDesk(desk);
      playAudio("handThrowDice");
    });

    socket.on(EVENTS.ON_FINISH_THROW_DICE, (desk: DeskType) => {
      setDesk(desk);
      setIsControlsLoading(false);

      if (desk.gameplay.isShowConclusion) {
        toggleGameOpen(GAME_OPEN.CONCLUSION);
      }
    });

    socket.on(EVENTS.ON_SELECT_DICE, (desk: DeskType) => {
      setDesk(desk);
      setIsControlsLoading(false);
      playAudio("selectDieForReroll");
    });

    socket.on(EVENTS.ON_CLOSE_CONCLUSION, (desk: DeskType) => {
      setDesk(desk);
      toggleGameOpen(GAME_OPEN.CONCLUSION);
    });

    socket.on(EVENTS.ON_END_GAME, (desk: DeskType) => {
      setDesk(desk);
      toggleGameOpen(GAME_OPEN.CONCLUSION);
    });

    socket.on(EVENTS.ON_CHANGE_SETTINGS, (desk: DeskType) => {
      setDesk(desk);
    });

    return () => {
      socket.emit(MESSAGES.LEAVE_DESK);

      console.warn("Unregistering events...");
      [
        EVENTS.ON_JOIN_DESK,
        EVENTS.ON_START_GAME,
        EVENTS.ON_START_THROW_DICE,
        EVENTS.ON_THROW_DICE,
        EVENTS.ON_FINISH_THROW_DICE,
        EVENTS.ON_CLOSE_CONCLUSION,
        EVENTS.ON_END_GAME,
        EVENTS.ON_CHANGE_SETTINGS,
        EVENTS.ON_LEAVE_DESK,
      ].forEach((event) => {
        socket.off(event);
      });
    };
  }, []);

  const handleInitializePlayer = (credentials: CredentialsType) => {
    socket?.emit(MESSAGES.JOIN_DESK, {
      desk: desk._id,
      name: credentials.name,
    });
  };

  const handleCloseCredentials = () => {
    push("/online");
  };

  return (
    <>
      {desk ? (
        <>
          <Status />
          <History />
          <Players />
          <Controls />
          <Settings />
          <Conclusion />
          <Desk cubes={Cubes} />
        </>
      ) : (
        <Loading />
      )}
      <Credentials
        isOpen={isOpen}
        setCredentials={handleSetCredentials}
        toggleIsOpen={handleCloseCredentials}
      />
      <Navigator text="Desks" url="/online" />
    </>
  );
};
