import { server } from "@utils/api/api";
import { io, Socket } from "socket.io-client";
import { GameProvider } from "@utils/contexts/GameContext";
import { createContext, FC, ReactNode, useContext } from "react";
import { DeskOnlineProvider } from "@utils/contexts/DeskOnlineProvider";

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
