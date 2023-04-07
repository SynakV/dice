import { useDesk } from "@utils/contexts/DeskContext";
import { MESSAGES, DeskType } from "@utils/common/types";
import { STORAGE_ITEMS } from "@utils/helpers/storage/constants";
import {
  getStorageObjectItem,
  setStorageItem,
} from "@utils/helpers/storage/storage.helper";
import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";
import { Loading } from "../../Shared/Loading/Loading";
import { Game } from "@components/Mode/Online/Game/Game";
import { Players } from "@components/Mode/Shared/Players/Players";
import { Credentials } from "../../Shared/Credentials/Credentials";
import { Navigator } from "@components/Shared/Navigator/Navigator";
import { CredentialsType } from "../../Shared/Credentials/utils/types";
import { useNotification } from "../../Shared/Notification/Notification";

export const Online: FC = () => {
  const { push } = useRouter();
  const { desk, socket } = useDesk();
  const { notification } = useNotification();

  const [isOpen, setIsOpen] = useState(false);

  const credentials = getStorageObjectItem(STORAGE_ITEMS.CREDENTIALS);

  const handleSameNameNotification = (
    data: DeskType,
    credentials: CredentialsType
  ) => {
    const playersNames = data.gameplay.players.map((player) => player.name);

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
    socket?.emit(MESSAGES.JOIN_DESK, {
      desk: desk._id,
      name: getStorageObjectItem(STORAGE_ITEMS.CREDENTIALS)?.name,
    });
  };

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
