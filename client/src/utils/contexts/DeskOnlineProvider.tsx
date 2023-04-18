import { useRouter } from "next/router";
import { getRequest } from "@utils/api/api";
import useSWRImmutable from "swr/immutable";
import { FC, useEffect, useState } from "react";
import { DEFAULT_DESK } from "@utils/common/constants";
import { useSocket } from "@utils/contexts/SocketContext";
import { DeskCommonProps, DeskProvider } from "@utils/contexts/DeskContext";
import {
  DeskType,
  RerollType,
  SettingsType,
  RankingWithInfoType,
} from "@utils/common/types";
import {
  afterStartGame,
  afterStartThrowDice,
  afterThrowDice,
  afterFinishThrowDice,
  afterPassThrowDice,
  afterSelectDice,
  afterCloseConclusion,
  afterEndGame,
  afterChangeSettings,
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

  const startThrowDice = () => {
    setDesk((prev) => afterStartThrowDice(prev, socket));
  };

  const throwDice = (ranking: RankingWithInfoType) => {
    setDesk((prev) => afterThrowDice(prev, ranking, socket));
  };

  const finishThrowDice = () => {
    setDesk((prev) => afterFinishThrowDice(prev, socket));
  };

  const passThrowDice = () => {
    setDesk((prev) => afterPassThrowDice(prev, socket));
  };

  const selectDice = (selectedDice: RerollType) => {
    setDesk((prev) => afterSelectDice(prev, selectedDice, socket));
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
        startThrowDice,
        throwDice,
        finishThrowDice,
        passThrowDice,
        selectDice,
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
