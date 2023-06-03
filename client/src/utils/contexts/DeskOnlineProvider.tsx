import { useRouter } from "next/router";
import { getRequest } from "@utils/api/api";
import { FC, useEffect, useState } from "react";
import { Guard } from "@components/Mode/Online/Guard";
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
  const socket = useSocket();
  const { query } = useRouter();

  const [desk, setDesk] = useState<DeskType>(DEFAULT_DESK);

  useEffect(() => {
    if (query.id) {
      (async () => {
        setDesk(await getRequest<DeskType>("desk/" + query.id));
      })();
    }
  }, [query]);

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

  return (
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
    >
      <Guard>{children}</Guard>
    </DeskProvider>
  );
};
