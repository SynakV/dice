import { EVENTS } from "../common/types";
import { io, Socket } from "socket.io-client";
import { createContext, FC, ReactNode, useContext, useEffect } from "react";

export const socket = io("http://localhost:3001");
export const WebsocketContext = createContext<Socket>(socket);

interface Props {
  children: ReactNode;
}

export const WebsocketProvider: FC<Props> = ({ children }) => {
  useEffect(() => {
    return () => {
      console.log("Unregistering events...");
      socket.off(EVENTS.CONNECTION);
      socket.off(EVENTS.ON_MESSAGE);
      socket.off(EVENTS.ON_JOIN_DESK);
      socket.off(EVENTS.ON_LEAVE_DESK);
      socket.off(EVENTS.ON_GAME_START);
    };
  }, []);

  return (
    <WebsocketContext.Provider value={socket}>
      {children}
    </WebsocketContext.Provider>
  );
};

export const useWebsocket = () => useContext(WebsocketContext);