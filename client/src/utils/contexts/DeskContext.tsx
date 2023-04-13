import {
  FC,
  ReactNode,
  useContext,
  createContext,
  SetStateAction,
  Dispatch,
} from "react";
import type { Socket } from "socket.io-client";
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
  setDesk: Dispatch<SetStateAction<DeskType>>;
  handle: {
    startGame: () => void;
    startThrowDice: () => void;
    throwDice: (ranking: RankingResultWithInfoType) => void;
    finishThrowDice: () => void;
    closeConclusion: (isLastRound: boolean) => void;
    endGame: () => void;
    changeSettings: (settings: SettingsType) => void;
  };
}

const DEFAULT_VALUES = {
  desk: DEFAULT_DESK,
  setDesk: () => {},
  handle: {
    startGame: () => {},
    startThrowDice: () => {},
    throwDice: () => {},
    finishThrowDice: () => {},
    closeConclusion: () => {},
    endGame: () => {},
    changeSettings: () => {},
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
  setDesk,
  children,
}) => {
  return (
    <DeskContext.Provider value={{ setDesk, handle, socket, desk }}>
      <GameProvider>{desk && children}</GameProvider>
    </DeskContext.Provider>
  );
};

export const useDesk = () => useContext(DeskContext);
