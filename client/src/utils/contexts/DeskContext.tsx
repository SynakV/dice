import { FC, ReactNode, useContext, createContext } from "react";
import { Socket } from "socket.io-client";
import {
  DeskType,
  SettingsType,
  RankingResultWithInfoType,
} from "../common/types";
import { GameProvider } from "./GameContext";
import { DEFAULT_DESK } from "@utils/common/constants";

interface DeskContext {
  desk: DeskType;
  socket?: Socket;
  handle: {
    startGame: () => void;
    triggerStageStart: () => void;
    endGame: () => void;
    throwDice: (ranking: RankingResultWithInfoType) => void;
    settingsChange: (settings: SettingsType) => void;
    conclusionClose: (isLastRound: boolean) => void;
  };
}

const DEFAULT_VALUES = {
  desk: DEFAULT_DESK,
  handle: {
    startGame: () => {},
    triggerStageStart: () => {},
    endGame: () => {},
    throwDice: () => {},
    settingsChange: () => {},
    conclusionClose: () => {},
  },
};

export const DeskContext = createContext<DeskContext>(DEFAULT_VALUES);

export interface DeskCommonProps {
  children: ReactNode;
}

export const DeskProvider: FC<DeskCommonProps & DeskContext> = ({
  desk,
  socket,
  handle,
  children,
}) => {
  return (
    <DeskContext.Provider value={{ handle, socket, desk }}>
      <GameProvider>{desk && children}</GameProvider>
    </DeskContext.Provider>
  );
};

export const useDesk = () => useContext(DeskContext);
