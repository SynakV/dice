import {
  DeskType,
  RerollType,
  SettingsType,
  RankingWithInfoType,
} from "@utils/common/types";
import { FC, useState } from "react";
import { DEFAULT_DESK } from "@utils/common/constants";
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
  getPlayer,
} from "@utils/helpers/gameplay/gameplay.offline.helper";
import { useGame } from "./GameContext";

export const DeskOfflineProvider: FC<DeskCommonProps> = ({ children }) => {
  const { player, setPlayer } = useGame();
  const [desk, setDesk] = useState<DeskType>(DEFAULT_DESK);

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
    const newPlayer = getPlayer(player?.name || "");
    setPlayer(newPlayer);
    setDesk((prev) => afterChangeSettings(prev, settings, newPlayer));
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
