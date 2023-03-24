import { useDesk } from "@src/utils/contexts/DeskContext";
import { useSocket } from "@src/utils/contexts/WebsocketContext";
import { STORAGE_ITEMS } from "@src/utils/helpers/storage/constants";
import { EVENTS, MESSAGES, DeskType } from "@src/utils/common/types";
import {
  getStorageObjectItem,
  setStorageItem,
} from "@src/utils/helpers/storage/storage.helper";
import { useRouter } from "next/router";
import { Game } from "@src/components/Game/Game";
import { Players } from "../../Game/Players/Players";
import React, { FC, useEffect, useState } from "react";
import { Loading } from "../../Shared/Loading/Loading";
import { Credentials } from "../../Shared/Credentials/Credentials";
import { CredentialsType } from "../../Shared/Credentials/utils/types";
import { Navigator } from "@src/components/Shared/Navigator/Navigator";
import { useNotification } from "../../Shared/Notification/Notification";

export const Online: FC = () => {
  const socket = useSocket();
  const { push, query } = useRouter();
  const { desk, setDesk } = useDesk();
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

    if (!credentials.name || handleSameNameNotification(desk, credentials)) {
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

  return (
    <>
      {desk ? (
        <>
          <Game />
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
      <Navigator text="Desks" url="/online" />
    </>
  );
};
