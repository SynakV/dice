import { useDesk } from "@src/utils/contexts/DeskContext";
import { useWebsocket } from "@src/utils/contexts/WebsocketContext";
import { shuffleArray } from "@src/utils/helpers/randomizer.helper";
import { STORAGE_ITEMS } from "@src/utils/helpers/storage/constants";
import { EVENTS, MESSAGES, DeskType } from "@src/utils/common/types";
import {
  getStorageObjectItem,
  setStorageItem,
} from "@src/utils/helpers/storage/storage.helper";
import { Game } from "../Game/Game";
import { useRouter } from "next/router";
import { Loading } from "../Loading/Loading";
import { Players } from "../Game/Players/Players";
import React, { FC, useEffect, useState } from "react";
import { useNotification } from "../Notification/Notification";
import { Credentials } from "../Selector/Credentials/Credentials";
import { CredentialsType } from "../Selector/Credentials/utils/types";

export const Online: FC = () => {
  const socket = useWebsocket();
  const { desk, setDesk } = useDesk();
  const { push, query } = useRouter();
  const { notification } = useNotification();

  const [isOpen, setIsOpen] = useState(false);

  const credentials = getStorageObjectItem(STORAGE_ITEMS.CREDENTIALS);

  const handleSameNameNotification = (
    data: DeskType,
    credentials: CredentialsType
  ) => {
    const playersNames = data?.players?.players?.map((player) => player.name);

    if (playersNames?.includes(credentials.name)) {
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
    handleInitializePlayer();
    setStorageItem(STORAGE_ITEMS.CREDENTIALS, JSON.stringify(credentials));
  };

  useEffect(() => {
    if (!desk) {
      return;
    }

    if (!credentials.name) {
      return setIsOpen(true);
    }

    const isSameName = handleSameNameNotification(desk, credentials);

    if (isSameName) {
      return setIsOpen(true);
    }

    handleInitializePlayer();
  }, []);

  const handleInitializePlayer = () => {
    socket.emit(MESSAGES.JOIN_DESK, {
      desk: desk?._id,
      name: getStorageObjectItem(STORAGE_ITEMS.CREDENTIALS)?.name,
    });
  };

  useEffect(() => {
    [EVENTS.ON_GAME_START, EVENTS.ON_JOIN_DESK, EVENTS.ON_LEAVE_DESK].forEach(
      (event) => {
        socket.on(event, (desk: DeskType) => {
          setDesk(desk);
        });
      }
    );

    return () => {
      socket.emit(MESSAGES.LEAVE_DESK);
    };
  }, []);

  const handleCloseCredentials = () => {
    push("/online");
  };

  const handleGameStarted = () => {
    if (desk?.players?.players) {
      socket.emit(MESSAGES.GAME_START, {
        id: query.id,
        sequence: shuffleArray(desk.players.players),
      });
    }
  };

  return (
    <>
      {desk ? (
        <>
          <Game desk={desk} onGameStarted={handleGameStarted} />
          <Players />
        </>
      ) : (
        <Loading />
      )}
      <Credentials
        isOpen={isOpen}
        setCredentials={handleSetCredentials}
        toggleIsOpen={handleCloseCredentials}
      />
    </>
  );
};
