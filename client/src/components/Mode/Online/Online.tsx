import { useRouter } from "next/router";
import { useDesk } from "@utils/contexts/DeskContext";
import React, { FC, useEffect, useState } from "react";
import { playAudio } from "@utils/helpers/audio.helper";
import { Desk } from "@components/Mode/Shared/Desk/Desk";
import { EVENTS, MESSAGES } from "@utils/common/constants";
import { Cubes } from "@components/Mode/Online/Cubes/Cubes";
import { Loading } from "@components/Shared/Loading/Loading";
import { Status } from "@components/Mode/Shared/Status/Status";
import { Settings } from "@components/Shared/Settings/Settings";
import { GAME_OPEN, useGame } from "@utils/contexts/GameContext";
import { History } from "@components/Mode/Shared/History/History";
import { Navigator } from "@components/Shared/Navigator/Navigator";
import { Controls } from "@components/Mode/Online/Controls/Controls";
import { Credentials } from "@components/Shared/Credentials/Credentials";
import { Conclusion } from "@components/Mode/Online/Conclusion/Conclusion";
import { CredentialsType, DeskType, PlayerType } from "@utils/common/types";
import { useNotification } from "@components/Shared/Notification/Notification";
import {
  getCredentials,
  setCredentials,
} from "@utils/helpers/storage/storage.helper";

export const Online: FC = () => {
  const { push } = useRouter();
  const { notification } = useNotification();
  const { desk, socket, setDesk } = useDesk();
  const { player, setPlayer, toggleGameOpen, setIsControlsLoading } = useGame();

  const [isOpen, setIsOpen] = useState(false);

  const handleSameNameNotification = (
    data: DeskType,
    credentials: CredentialsType
  ) => {
    const playersNames = data.gameplay.players.map((player) => player.name);

    if (playersNames.includes(credentials.name || "")) {
      notification(`Name ${credentials.name} already present in the desk`);
      return true;
    }

    return false;
  };

  const handleSetCredentials = (credentials: CredentialsType) => {
    if (handleSameNameNotification(desk, credentials)) {
      return;
    }

    setIsOpen(false);
    setPlayer(credentials as PlayerType);
    setCredentials(JSON.stringify(credentials));
  };

  useEffect(() => {
    if (!player || player?.id) {
      return;
    }

    if (!player.name || handleSameNameNotification(desk, player)) {
      setIsOpen(true);
    } else {
      handleInitializePlayer(player);
    }
  }, [player]);

  const handleInitializePlayer = ({ name }: CredentialsType) => {
    setPlayer({ id: socket?.id } as PlayerType);
    socket?.emit(MESSAGES.JOIN_DESK, {
      desk: desk._id,
      name,
    });
  };

  const handleCloseCredentials = () => {
    push("/online");
  };

  useEffect(() => {
    if (!socket) {
      return;
    }

    if (socket.connected) {
      setPlayer(getCredentials());
    } else {
      socket.on("connect", () => {
        setPlayer(getCredentials());
      });
    }

    [EVENTS.ON_JOIN_DESK, EVENTS.ON_LEAVE_DESK].forEach((event) => {
      socket.on(event, (desk: DeskType) => {
        setDesk(desk);
      });
    });

    socket.on(EVENTS.ON_START_GAME, (desk: DeskType) => {
      setDesk(desk);
      setIsControlsLoading(false);
      playAudio("nextRoundStart");
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
      } else {
        playAudio("playerThinking");
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

  const isShowGameDesk = desk._id && player?.id;

  return (
    <>
      {isShowGameDesk ? (
        <>
          <Status />
          <History />
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
        credentials={player}
        setCredentials={handleSetCredentials}
        toggleIsOpen={handleCloseCredentials}
      />
      <Navigator url="/online" />
    </>
  );
};
