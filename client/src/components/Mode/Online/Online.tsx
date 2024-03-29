import { useRouter } from "next/router";
import { useDesk } from "@utils/contexts/DeskContext";
import React, { FC, useEffect, useState } from "react";
import { Desk } from "@components/Mode/Shared/Desk/Desk";
import { EVENTS, MESSAGES } from "@utils/common/constants";
import { Cubes } from "@components/Mode/Online/Cubes/Cubes";
import { Loading } from "@components/Shared/Loading/Loading";
import { Confirm } from "@components/Shared/Confirm/Confirm";
import { Status } from "@components/Mode/Shared/Status/Status";
import { Settings } from "@components/Shared/Settings/Settings";
import { GAME_OPEN, useGame } from "@utils/contexts/GameContext";
import { History } from "@components/Mode/Shared/History/History";
import { Navigator } from "@components/Shared/Navigator/Navigator";
import {
  useMedia,
  playSound,
  MUSIC_NAME,
  VIDEO_NAME,
  DEFAULT_FADE_TIME,
} from "@utils/contexts/MediaProvider";
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
  const { replace } = useRouter();
  const { notification } = useNotification();
  const { desk, socket, setDesk } = useDesk();
  const { playMusic, playVideo } = useMedia();
  const { player, setPlayer, toggleGameOpen, setIsControlsLoading } = useGame();

  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

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

  useEffect(() => {
    playMusic({
      name: MUSIC_NAME.PREFIGHT,
      switchDuration: DEFAULT_FADE_TIME,
    });
    playVideo({
      name: VIDEO_NAME.PREFIGHT,
      appFadeDuration: DEFAULT_FADE_TIME,
    });
  }, []);

  const handleInitializePlayer = ({ name }: CredentialsType) => {
    setPlayer({ id: socket?.id } as PlayerType);
    socket?.emit(MESSAGES.JOIN_DESK, {
      desk: desk._id,
      name,
    });
  };

  const handleCloseCredentials = () => {
    replace("/online");
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

      playMusic({
        name: MUSIC_NAME.FIGHT,
        isSwitchInPage: true,
        switchDuration: 1000,
      });

      playVideo({
        name: VIDEO_NAME.FIGHT,
        isSwitchInPage: true,
        videoFadeDuraion: 1000,
      });

      playSound("nextRoundStart");
    });

    socket.on(EVENTS.ON_START_THROW_DICE, (desk: DeskType) => {
      setDesk(desk);
      playSound("handMixDice");
      setIsControlsLoading(false);
    });

    socket.on(EVENTS.ON_THROW_DICE, (desk: DeskType) => {
      setDesk(desk);
      playSound("handThrowDice");
    });

    socket.on(EVENTS.ON_FINISH_THROW_DICE, (desk: DeskType) => {
      setDesk(desk);
      setIsControlsLoading(false);

      if (desk.gameplay.isShowConclusion) {
        toggleGameOpen(GAME_OPEN.CONCLUSION);
      } else {
        playSound("playerThinking");
      }
    });

    socket.on(EVENTS.ON_SELECT_DICE, (desk: DeskType) => {
      setDesk(desk);
      setIsControlsLoading(false);
      playSound("selectDieForReroll");
    });

    socket.on(EVENTS.ON_CLOSE_CONCLUSION, (desk: DeskType) => {
      setDesk(desk);
      toggleGameOpen(GAME_OPEN.CONCLUSION);
    });

    socket.on(EVENTS.ON_END_GAME, (desk: DeskType) => {
      setDesk(desk);

      playMusic({
        name: MUSIC_NAME.PREFIGHT,
        isSwitchInPage: true,
        switchDuration: 1000,
      });

      playVideo({
        name: VIDEO_NAME.PREFIGHT,
        isSwitchInPage: true,
        videoFadeDuraion: 1000,
      });

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
      <Navigator
        url="/online"
        onNavigate={
          desk.gameplay.isGameStarted ? () => handleNavigate() : undefined
        }
      />
      <Confirm
        ok="Yes"
        cancel="No"
        isOpen={isConfirmOpen}
        onConfirm={handleConfirm}
        title="Do you want to exit?"
      />
    </>
  );
};
