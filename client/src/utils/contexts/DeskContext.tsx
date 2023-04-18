import {
  FC,
  Dispatch,
  ReactNode,
  useContext,
  createContext,
  SetStateAction,
} from "react";
import type { Socket } from "socket.io-client";
import {
  DeskType,
  RerollType,
  SettingsType,
  RankingWithInfoType,
} from "@utils/common/types";
import { DEFAULT_DESK } from "@utils/common/constants";
import { GameProvider } from "@utils/contexts/GameContext";

interface DeskContext {
  desk: DeskType;
  socket?: Socket;
  setDesk: Dispatch<SetStateAction<DeskType>>;
  handle: {
    startGame: () => void;
    startThrowDice: () => void;
    throwDice: (ranking: RankingWithInfoType) => void;
    finishThrowDice: () => void;
    passThrowDice: () => void;
    selectDice: (selectedDice: RerollType) => void;
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
    passThrowDice: () => {},
    selectDice: () => {},
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
