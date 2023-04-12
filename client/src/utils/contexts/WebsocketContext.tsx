import { server } from "../api/api";
import { GameProvider } from "./GameContext";
import { io, Socket } from "socket.io-client";
import { DeskOnlineProvider } from "./DeskOnlineProvider";
import { createContext, FC, ReactNode, useContext } from "react";

export const socket = io(server);
export const SocketContext = createContext<Socket>(socket);

interface Props {
  children: ReactNode;
}

export const SocketProvider: FC<Props> = ({ children }) => (
  <SocketContext.Provider value={socket}>
    <GameProvider>
      <DeskOnlineProvider>{children}</DeskOnlineProvider>
    </GameProvider>
  </SocketContext.Provider>
);

export const useSocket = () => useContext(SocketContext);
