import {
  FC,
  Dispatch,
  ReactNode,
  useContext,
  createContext,
  SetStateAction,
} from "react";
import { Socket } from "socket.io-client";
import { DeskType } from "../common/types";
import { GameProvider } from "./GameContext";
import { DEFAULT_DESK } from "@utils/common/constants";

interface DeskContext {
  desk: DeskType;
  socket?: Socket;
  setDesk: Dispatch<SetStateAction<DeskType>>;
}

const DEFAULT_VALUES = {
  desk: DEFAULT_DESK,
  setDesk: () => {},
};

export const DeskContext = createContext<DeskContext>(DEFAULT_VALUES);

export interface DeskCommonProps {
  children: ReactNode;
}

export const DeskProvider: FC<DeskCommonProps & DeskContext> = ({
  desk,
  socket,
  setDesk,
  children,
}) => (
  <DeskContext.Provider value={{ socket, desk, setDesk }}>
    <GameProvider>{desk && children}</GameProvider>
  </DeskContext.Provider>
);

export const useDesk = () => useContext(DeskContext);
