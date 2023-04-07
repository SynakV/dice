import { useRouter } from "next/router";
import { getRequest } from "../api/api";
import useSWRImmutable from "swr/immutable";
import { useSocket } from "./WebsocketContext";
import { FC, useEffect, useState } from "react";
import { DEFAULT_DESK } from "@utils/common/constants";
import { DeskCommonProps, DeskProvider } from "./DeskContext";
import {
  EVENTS,
  MESSAGES,
  DeskType,
  SettingsType,
  RankingResultWithInfoType,
} from "@utils/common/types";
import {
  afterConclusionClose,
  afterEndGame,
  afterSettingsChange,
  afterStageFinish,
  afterStartGame,
  afterThrowDice,
  afterTriggerStageStart,
} from "@utils/helpers/gameplay/gameplay.online.helper";

export const DeskOnlineProvider: FC<DeskCommonProps> = ({ children }) => {
  const [desk, setDesk] = useState<DeskType>(DEFAULT_DESK);
  const socket = useSocket();
  const { query } = useRouter();
  const { data } = useSWRImmutable(
    () => (query.id ? `desk/${query.id}` : null),
    getRequest<DeskType>
  );

  useEffect(() => {
    [
      EVENTS.ON_JOIN_DESK,
      EVENTS.ON_LEAVE_DESK,
      EVENTS.ON_GAME_START,
      EVENTS.ON_DESK_CHANGE,
    ].forEach((event) => {
      socket.on(event, (desk: DeskType) => {
        setDesk(desk);
      });
    });

    return () => {
      socket.emit(MESSAGES.LEAVE_DESK);

      console.warn("Unregistering events...");
      socket.off(EVENTS.CONNECTION);
      socket.off(EVENTS.ON_JOIN_DESK);
      socket.off(EVENTS.ON_LEAVE_DESK);
      socket.off(EVENTS.ON_GAME_START);
      socket.off(EVENTS.ON_DESK_CHANGE);
    };
  }, []);

  useEffect(() => {
    if (data) {
      setDesk(data);
    }
  }, [data]);

  useEffect(() => {
    // console.log(desk);
  }, [desk]);

  const startGame = () => {
    setDesk((prev) => afterStartGame(prev, socket));
  };

  const triggerStageStart = () => {
    setDesk((prev) => afterTriggerStageStart(prev, socket));
  };

  const endGame = () => {
    setDesk((prev) => afterEndGame(prev, socket));
  };

  const throwDice = (ranking: RankingResultWithInfoType) => {
    setDesk((prev) => afterThrowDice(prev, ranking, socket));
  };

  const stageFinish = () => {
    setDesk((prev) => afterStageFinish(prev, socket));
  };

  const settingsChange = (settings: SettingsType) => {
    setDesk((prev) => afterSettingsChange(prev, settings, socket));
  };

  const conclusionClose = (isLastRound: boolean) => {
    setDesk((prev) => afterConclusionClose(prev, isLastRound, socket));
  };

  return desk._id ? (
    <DeskProvider
      handle={{
        startGame,
        triggerStageStart,
        throwDice,
        stageFinish,
        conclusionClose,
        endGame,
        settingsChange,
      }}
      desk={desk}
      socket={socket}
      children={children}
    />
  ) : null;
};
