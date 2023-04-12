import { useRouter } from "next/router";
import { getRequest } from "../api/api";
import useSWRImmutable from "swr/immutable";
import { useSocket } from "./WebsocketContext";
import { FC, useEffect, useState } from "react";
import { DEFAULT_DESK } from "@utils/common/constants";
import { DeskCommonProps, DeskProvider } from "./DeskContext";
import {
  DeskType,
  SettingsType,
  RankingResultWithInfoType,
} from "@utils/common/types";
import {
  afterCloseConclusion,
  afterEndGame,
  afterChangeSettings,
  afterFinishStage,
  afterStartGame,
  afterThrowDice,
  afterStartStage,
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
    if (data) {
      setDesk(data);
    }
  }, [data]);

  const startGame = () => {
    setDesk((prev) => afterStartGame(prev, socket));
  };

  const startStage = () => {
    setDesk((prev) => afterStartStage(prev, socket));
  };

  const throwDice = (ranking: RankingResultWithInfoType) => {
    setDesk((prev) => afterThrowDice(prev, ranking, socket));
  };

  const finishStage = () => {
    setDesk((prev) => afterFinishStage(prev, socket));
  };

  const closeConclusion = (isLastRound: boolean) => {
    setDesk((prev) => afterCloseConclusion(prev, isLastRound, socket));
  };

  const endGame = () => {
    setDesk((prev) => afterEndGame(prev, socket));
  };

  const changeSettings = (settings: SettingsType) => {
    setDesk((prev) => afterChangeSettings(prev, settings, socket));
  };

  return desk._id ? (
    <DeskProvider
      handle={{
        startGame,
        startStage,
        throwDice,
        finishStage,
        closeConclusion,
        endGame,
        changeSettings,
      }}
      desk={desk}
      socket={socket}
      setDesk={setDesk}
      children={children}
    />
  ) : null;
};