import {
  DeskType,
  RerollType,
  SettingsType,
  RankingWithInfoType,
} from "@utils/common/types";
import { FC, useEffect, useState } from "react";
import { DEFAULT_DESK } from "@utils/common/constants";
import { getCredentials } from "@utils/helpers/storage/storage.helper";
import { DeskCommonProps, DeskProvider } from "@utils/contexts/DeskContext";
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
} from "@utils/helpers/gameplay/gameplay.offline.helper";

export const DeskOfflineProvider: FC<DeskCommonProps> = ({ children }) => {
  const [desk, setDesk] = useState<DeskType>(DEFAULT_DESK);

  const player = {
    name: getCredentials().name,
  };

  useEffect(() => {
    setDesk((prev) => ({
      ...prev,
      creator: player,
      gameplay: {
        ...prev.gameplay,
        current: {
          ...prev.gameplay.current,
          player,
        },
      },
    }));
  }, []);

  const startGame = () => {
    setDesk(afterStartGame);
  };

  const startThrowDice = () => {
    setDesk(afterStartThrowDice);
  };

  const throwDice = (ranking: RankingWithInfoType) => {
    setDesk((prev) => afterThrowDice(prev, ranking));
  };

  const finishThrowDice = () => {
    setDesk(afterFinishThrowDice);
  };

  const passThrowDice = () => {
    setDesk(afterPassThrowDice);
  };

  const selectDice = (selectedDice: RerollType) => {
    setDesk((prev) => afterSelectDice(prev, selectedDice));
  };

  const closeConclusion = (isLastRound: boolean) => {
    setDesk((prev) => afterCloseConclusion(prev, isLastRound));
  };

  const endGame = () => {
    setDesk(afterEndGame);
  };

  const changeSettings = (settings: SettingsType) => {
    setDesk((prev) => afterChangeSettings(prev, settings));
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
      setDesk={setDesk}
      children={children}
    />
  );
};
