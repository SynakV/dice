import {
  DeskType,
  SettingsType,
  RankingResultWithInfoType,
} from "@utils/common/types";
import { FC, useEffect, useState } from "react";
import { DEFAULT_DESK } from "@utils/common/constants";
import { DeskCommonProps, DeskProvider } from "./DeskContext";
import { STORAGE_ITEMS } from "@utils/helpers/storage/constants";
import { getStorageObjectItem } from "@utils/helpers/storage/storage.helper";
import {
  afterConclusionClose,
  afterEndGame,
  afterSettingsChange,
  afterStageFinish,
  afterStartGame,
  afterThrowDice,
  afterTriggerStageStart,
} from "@utils/helpers/gameplay/gameplay.offline.helper";

export const DeskOfflineProvider: FC<DeskCommonProps> = ({ children }) => {
  const [desk, setDesk] = useState<DeskType>(DEFAULT_DESK);

  useEffect(() => {
    setDesk((prev) => ({
      ...prev,
      gameplay: {
        ...prev.gameplay,
        current: {
          ...prev.gameplay.current,
          player: {
            name: getStorageObjectItem(STORAGE_ITEMS.CREDENTIALS)?.name,
          },
        },
      },
    }));
  }, []);

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

  const stageFinish = () => {
    setDesk(afterStageFinish);
  };

  const settingsChange = (settings: SettingsType) => {
    setDesk((prev) => afterSettingsChange(prev, settings));
  };

  const conclusionClose = (isLastRound: boolean) => {
    setDesk((prev) => afterConclusionClose(prev, isLastRound));
  };

  return (
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
      children={children}
    />
  );
};
