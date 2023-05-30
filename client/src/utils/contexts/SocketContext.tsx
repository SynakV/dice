import io from "socket.io-client";
import { GameProvider } from "@utils/contexts/GameContext";
import { DeskOnlineProvider } from "@utils/contexts/DeskOnlineProvider";
import {
  FC,
  useState,
  ReactNode,
  useEffect,
  useContext,
  createContext,
} from "react";

export const SocketContext = createContext<any>({});

interface Props {
  children: ReactNode;
}

export const SocketProvider: FC<Props> = ({ children }) => {
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    (async () => {
      await fetch("/api/socket");
      setSocket(
        io(undefined as any, {
          path: "/api/socket_io",
          withCredentials: true,
        })
      );
    })();
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      <GameProvider>
        <DeskOnlineProvider>{children}</DeskOnlineProvider>
      </GameProvider>
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
