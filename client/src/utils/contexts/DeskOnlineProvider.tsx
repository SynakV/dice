import { useRouter } from "next/router";
import { getRequest } from "../api/api";
import useSWRImmutable from "swr/immutable";
import { useSocket } from "./WebsocketContext";
import { FC, useEffect, useState } from "react";
import { DEFAULT_DESK } from "@utils/common/constants";
import { DeskCommonProps, DeskProvider } from "./DeskContext";
import {
  DeskType,
  EVENTS,
  MESSAGES,
  RankingResultWithInfoType,
  SettingsType,
} from "@utils/common/types";
import {
  afterConclusionClose,
  afterEndGame,
  afterSettingsChange,
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
    [EVENTS.ON_GAME_START, EVENTS.ON_JOIN_DESK, EVENTS.ON_LEAVE_DESK].forEach(
      (event) => {
        socket.on(event, (desk: DeskType) => {
          setDesk(desk);
        });
      }
    );

    return () => {
      socket.emit(MESSAGES.LEAVE_DESK);

      console.warn("Unregistering events...");
      socket.off(EVENTS.CONNECTION);
      socket.off(EVENTS.ON_MESSAGE);
      socket.off(EVENTS.ON_JOIN_DESK);
      socket.off(EVENTS.ON_LEAVE_DESK);
      socket.off(EVENTS.ON_GAME_START);
    };
  }, []);

  useEffect(() => {
    if (data) {
      setDesk(data);
    }
  }, [data]);

  const startGame = () => {
    setDesk(afterStartGame);
  };

  const triggerStageStart = () => {
    setDesk(afterTriggerStageStart);
  };

  const endGame = () => {
    setDesk(afterEndGame);
  };

  const throwDice = (ranking: RankingResultWithInfoType) => {
    setDesk((prev) => afterThrowDice(prev, ranking));
  };

  const settingsChange = (settings: SettingsType) => {
    setDesk((prev) => afterSettingsChange(prev, settings));
  };

  const conclusionClose = (isLastRound: boolean) => {
    setDesk((prev) => afterConclusionClose(prev, isLastRound));
  };

  return desk._id ? (
    <DeskProvider
      handle={{
        startGame,
        triggerStageStart,
        endGame,
        throwDice,
        settingsChange,
        conclusionClose,
      }}
      desk={desk}
      socket={socket}
      children={children}
    />
  ) : null;
};
