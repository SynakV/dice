import { server } from "../api/api";
import { EVENTS } from "../common/types";
import { io, Socket } from "socket.io-client";
import { createContext, FC, ReactNode, useContext, useEffect } from "react";

export const socket = io(server);
export const SocketContext = createContext<Socket>(socket);

interface Props {
  children: ReactNode;
}

export const SocketProvider: FC<Props> = ({ children }) => {
  useEffect(() => {
    return () => {
      console.warn("Unregistering events...");
      socket.off(EVENTS.CONNECTION);
      socket.off(EVENTS.ON_MESSAGE);
      socket.off(EVENTS.ON_JOIN_DESK);
      socket.off(EVENTS.ON_LEAVE_DESK);
      socket.off(EVENTS.ON_GAME_START);
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
